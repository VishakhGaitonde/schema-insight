const express = require('express');
const router = express.Router();
const { detectSchemaDiff } = require('../engines/schemaDiff');
const { detectRedundancy } = require('../engines/redundancyDetector');
const { analyzeImpact } = require('../engines/impactAnalyzer');
const Analysis = require('../models/Analysis');
const {
  analysisCounter,
  redundancyScoreGauge,
  errorCounter,
} = require('../middleware/metrics');

// Input validation
function validateInput(schemaV1, schemaV2, dataset) {
  const errors = [];
  if (!schemaV1 || typeof schemaV1 !== 'object' || Array.isArray(schemaV1))
    errors.push('schemaV1 must be a JSON object');
  if (!schemaV2 || typeof schemaV2 !== 'object' || Array.isArray(schemaV2))
    errors.push('schemaV2 must be a JSON object');
  if (!Array.isArray(dataset))
    errors.push('dataset must be a JSON array');
  if (dataset && dataset.length > 500)
    errors.push('dataset must not exceed 500 rows');
  if (schemaV1 && Object.keys(schemaV1).length === 0)
    errors.push('schemaV1 must not be empty');
  if (schemaV2 && Object.keys(schemaV2).length === 0)
    errors.push('schemaV2 must not be empty');
  return errors;
}

router.post('/analyze', async (req, res) => {
  try {
    const { schemaV1, schemaV2, dataset } = req.body;

    const errors = validateInput(schemaV1, schemaV2, dataset);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const diff = detectSchemaDiff(schemaV1, schemaV2);
    const redundanciesV1 = detectRedundancy(schemaV1, dataset);
    const redundanciesV2 = detectRedundancy(schemaV2, dataset);
    const impact = analyzeImpact(diff, redundanciesV1, redundanciesV2);

    const result = { diff, redundanciesV1, redundanciesV2, impact };

    // Update Prometheus metrics
    analysisCounter.inc();
    redundancyScoreGauge.set(impact.redundancyScore);

    // Save to MongoDB (skip in test mode)
    if (process.env.NODE_ENV !== 'test') {
      try {
        await Analysis.create({ schemaV1, schemaV2, dataset, result });
      } catch (_) {}
    }

    res.json({ success: true, result });
  } catch (err) {
    errorCounter.inc({ route: '/analyze' });
    if (process.env.NODE_ENV !== 'test') {
      console.error(err);
    }
    res.status(500).json({ error: 'Analysis failed', detail: err.message });
  }
});

// Get last 10 analyses
router.get('/history', async (req, res) => {
  // Skip in test mode
  if (process.env.NODE_ENV === 'test') {
    return res.json({ success: true, analyses: [] });
  }
  
  try {
    const analyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('schemaV1 schemaV2 result.impact.redundancyScore createdAt');
    res.json({ success: true, analyses });
  } catch (err) {
    errorCounter.inc({ route: '/history' });
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
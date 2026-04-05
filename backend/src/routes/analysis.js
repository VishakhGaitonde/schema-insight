const express = require('express');
const router = express.Router();
const { detectSchemaDiff } = require('../engines/schemaDiff');
const { detectRedundancy } = require('../engines/redundancyDetector');
const { analyzeImpact } = require('../engines/impactAnalyzer');
const Analysis = require('../models/Analysis');

router.post('/analyze', async (req, res) => {
  try {
    const { schemaV1, schemaV2, dataset } = req.body;

    if (!schemaV1 || !schemaV2 || !dataset) {
      return res.status(400).json({ error: 'schemaV1, schemaV2, and dataset are required' });
    }

    const diff = detectSchemaDiff(schemaV1, schemaV2);
    const redundanciesV1 = detectRedundancy(schemaV1, dataset);
    const redundanciesV2 = detectRedundancy(schemaV2, dataset);
    const impact = analyzeImpact(diff, redundanciesV1, redundanciesV2);

    const result = {
      diff,
      redundanciesV1,
      redundanciesV2,
      impact,
    };

    // Save to MongoDB (optional — don't fail if DB is down)
    try {
      await Analysis.create({ schemaV1, schemaV2, dataset, result });
    } catch (_) {}

    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analysis failed', detail: err.message });
  }
});

module.exports = router;
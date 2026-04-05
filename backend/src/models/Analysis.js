const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  schemaV1: Object,
  schemaV2: Object,
  dataset: Array,
  result: Object,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
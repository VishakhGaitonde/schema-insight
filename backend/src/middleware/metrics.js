const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const analysisCounter = new client.Counter({
  name: 'schema_analyses_total',
  help: 'Total number of schema analyses performed',
  registers: [register],
});

const redundancyScoreGauge = new client.Gauge({
  name: 'last_redundancy_score',
  help: 'Redundancy score of the last analysis',
  registers: [register],
});

const errorCounter = new client.Counter({
  name: 'api_errors_total',
  help: 'Total number of API errors',
  labelNames: ['route'],
  registers: [register],
});

module.exports = {
  register,
  httpRequestDuration,
  analysisCounter,
  redundancyScoreGauge,
  errorCounter,
};
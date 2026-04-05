const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const client = require('prom-client');
require('dotenv').config();

const analysisRoutes = require('./routes/analysis');

const app = express();
app.use(cors());
app.use(express.json());

// Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/analysis', analysisRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/schemainsight';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Start server anyway for health checks / local dev without mongo
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB)`));
  });

module.exports = app;
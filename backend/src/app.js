const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const {
  register,
  httpRequestDuration,
} = require('./middleware/metrics');

const analysisRoutes = require('./routes/analysis');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// HTTP duration tracking
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

app.get('/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api/analysis', analysisRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    detail: err.message,
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://mongo:27017/schemainsight';
const isTestEnv = process.env.NODE_ENV === 'test';

let server;

// 🔹 Exported for testing
async function connectDatabase() {
  if (isTestEnv) return;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('⚠️ Continuing without DB (CI mode)');
  }
}

// 🔹 Exported
function startServer() {
  if (!server) {
    server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  }
  return server;
}

// 🔹 Exported
function setupGracefulShutdown() {
  process.on('SIGTERM', () => {
    if (!server) return;

    server.close(() => {
      mongoose.connection.close();
      console.log('Server shut down gracefully');
    });
  });
}

// 🔹 Exported
async function bootstrap() {
  await connectDatabase();
  startServer();
  setupGracefulShutdown();
}

// Run only outside test
if (!isTestEnv) {
  bootstrap().catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

// 🔹 Cleanup helpers
function closeServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        server = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

function closeDatabase() {
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, 2000);

    mongoose
      .disconnect()
      .then(() => {
        clearTimeout(timeout);
        resolve();
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve();
      });
  });
}

// 🔹 Export everything needed for coverage
module.exports = {
  app,
  connectDatabase,
  startServer,
  setupGracefulShutdown,
  bootstrap,
  closeServer,
  closeDatabase,
};
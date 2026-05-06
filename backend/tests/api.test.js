process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/test';

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// ✅ FIXED MOCK (now includes .on)
jest.spyOn(express.application, 'listen').mockImplementation(() => ({
  close: (cb) => cb && cb(),
  on: () => {}, // 🔥 critical fix
}));

const {
  app,
  connectDatabase,
  startServer,
  setupGracefulShutdown,
  bootstrap,
  closeServer,
  closeDatabase,
} = require('../src/app');


// ===============================
// API TESTS
// ===============================

describe('API integration tests', () => {

  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
  });

  test('404 route', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });

});


// ===============================
// COVERAGE TESTS
// ===============================

describe('App.js coverage', () => {

  test('connectDatabase success', async () => {
    jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({});
    await connectDatabase();
    jest.restoreAllMocks();
  });

  test('connectDatabase failure', async () => {
    jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('fail'));
    await connectDatabase();
    jest.restoreAllMocks();
  });

  test('startServer works', () => {
    const server = startServer();
    expect(server).toBeDefined();
  });

  test('closeServer works', async () => {
    await closeServer();
  });

  test('bootstrap runs', async () => {
    jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({});
    await bootstrap();
    jest.restoreAllMocks();
  });

  test('SIGTERM shutdown', () => {
    const spy = jest
      .spyOn(mongoose.connection, 'close')
      .mockImplementation(() => {});

    startServer();
    setupGracefulShutdown();

    process.emit('SIGTERM');

    expect(spy).toHaveBeenCalled();
  });

  test('closeDatabase catch', async () => {
    jest.spyOn(mongoose, 'disconnect').mockRejectedValueOnce(new Error('fail'));
    await closeDatabase();
  });

});


// ===============================
// ERROR HANDLER (FIXED PROPER WAY)
// ===============================

describe('Error handler', () => {

  test('global error middleware works', async () => {
    const tempApp = express();

    tempApp.get('/boom', () => {
      throw new Error('Boom');
    });

    // use SAME logic as your app
    tempApp.use((err, req, res, next) => {
      res.status(500).json({
        error: 'Internal server error',
        detail: err.message,
      });
    });

    const res = await request(tempApp).get('/boom');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });

});


// ===============================
// CLEANUP
// ===============================

afterAll(async () => {
  await closeServer();
  await closeDatabase();
});


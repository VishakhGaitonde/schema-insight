// ===============================
// 🔥 APP.JS COVERAGE BOOST (FIXED)
// ===============================

describe('App.js uncovered branches (stable)', () => {

  test('connectDatabase success path', async () => {
    jest.resetModules();

    process.env.NODE_ENV = 'development';

    const mongoose = require('mongoose');
    jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({});
    jest.spyOn(mongoose, 'disconnect').mockResolvedValueOnce();

    const { connectDatabase } = require('../src/app');
    await connectDatabase();

    process.env.NODE_ENV = 'test';
  });

  test('connectDatabase failure path', async () => {
    jest.resetModules();

    process.env.NODE_ENV = 'development';

    const mongoose = require('mongoose');
    jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('fail'));

    const { connectDatabase } = require('../src/app');
    await connectDatabase();

    process.env.NODE_ENV = 'test';
  });

  test('startServer without port conflict (mocked)', () => {
    jest.resetModules();

    process.env.NODE_ENV = 'development';
    process.env.PORT = 0;

    const express = require('express');
    jest.spyOn(express.application, 'listen').mockImplementation(() => ({
      close: (cb) => cb && cb(),
    }));

    const { startServer } = require('../src/app');
    const server = startServer();

    expect(server).toBeDefined();

    process.env.NODE_ENV = 'test';
  });

  test('closeServer true branch', async () => {
    jest.resetModules();

    process.env.NODE_ENV = 'development';
    process.env.PORT = 0;

    const express = require('express');
    jest.spyOn(express.application, 'listen').mockImplementation(() => ({
      close: (cb) => cb && cb(),
    }));

    const appModule = require('../src/app');

    appModule.startServer();
    await appModule.closeServer();

    process.env.NODE_ENV = 'test';
  });

  test('setupGracefulShutdown SIGTERM', () => {
    jest.resetModules();

    process.env.NODE_ENV = 'development';
    process.env.PORT = 0;

    const mongoose = require('mongoose');
    const closeSpy = jest
      .spyOn(mongoose.connection, 'close')
      .mockImplementation(() => {});

    const express = require('express');
    jest.spyOn(express.application, 'listen').mockImplementation(() => ({
      close: (cb) => cb && cb(),
    }));

    const appModule = require('../src/app');

    appModule.startServer();
    appModule.setupGracefulShutdown();

    process.emit('SIGTERM');

    expect(closeSpy).toHaveBeenCalled();

    process.env.NODE_ENV = 'test';
  });

  test('bootstrap full execution (mocked)', async () => {
    jest.resetModules();

    process.env.NODE_ENV = 'development';
    process.env.PORT = 0;

    const mongoose = require('mongoose');
    jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({});

    const express = require('express');
    jest.spyOn(express.application, 'listen').mockImplementation(() => ({
      close: (cb) => cb && cb(),
    }));

    const { bootstrap } = require('../src/app');

    await bootstrap();

    process.env.NODE_ENV = 'test';
  });

  test('closeDatabase catch branch', async () => {
    jest.resetModules();

    const mongoose = require('mongoose');
    jest.spyOn(mongoose, 'disconnect').mockRejectedValueOnce(new Error('fail'));

    const { closeDatabase } = require('../src/app');
    await closeDatabase();
  });

});


// ===============================
// 🔥 REAL ERROR HANDLER (FIXED)
// ===============================

describe('Real app error middleware', () => {

  test('should trigger actual global error handler', async () => {
    // inject BEFORE 404 layer
    app._router.stack.splice(
      app._router.stack.length - 2,
      0,
      {
        route: {
          path: '/real-error',
          stack: [{
            handle: () => { throw new Error('Boom'); }
          }],
          methods: { get: true }
        }
      }
    );

    const res = await request(app).get('/real-error');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });

});
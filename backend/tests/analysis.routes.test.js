const request = require('supertest');
const express = require('express');

process.env.NODE_ENV = 'test';

const router = require('../src/routes/analysis');

const app = express();
app.use(express.json());
app.use('/api/analysis', router);

describe('Analysis Routes', () => {

  test('POST /analyze - success case', async () => {
    const res = await request(app)
      .post('/api/analysis/analyze')
      .send({
        schemaV1: { name: 'string' },
        schemaV2: { name: 'string', age: 'number' },
        dataset: [{ name: 'A', age: 20 }]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result).toBeDefined();
  });

  test('POST /analyze - validation error (empty schema)', async () => {
    const res = await request(app)
      .post('/api/analysis/analyze')
      .send({
        schemaV1: {},
        schemaV2: {},
        dataset: []
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  test('POST /analyze - invalid dataset type', async () => {
    const res = await request(app)
      .post('/api/analysis/analyze')
      .send({
        schemaV1: { a: 'string' },
        schemaV2: { a: 'string' },
        dataset: "wrong"
      });

    expect(res.status).toBe(400);
  });

  test('POST /analyze - dataset > 500 rows', async () => {
    const dataset = Array.from({ length: 501 }, () => ({ a: 1 }));

    const res = await request(app)
      .post('/api/analysis/analyze')
      .send({
        schemaV1: { a: 'string' },
        schemaV2: { a: 'string' },
        dataset
      });

    expect(res.status).toBe(400);
  });

  test('POST /analyze - internal error path', async () => {
    jest.resetModules();

    jest.doMock('../src/engines/schemaDiff', () => ({
      detectSchemaDiff: () => { throw new Error('boom'); }
    }));

    const faultyRouter = require('../src/routes/analysis');

    const tempApp = express();
    tempApp.use(express.json());
    tempApp.use('/api/analysis', faultyRouter);

    const res = await request(tempApp)
      .post('/api/analysis/analyze')
      .send({
        schemaV1: { a: 'string' },
        schemaV2: { a: 'string' },
        dataset: []
      });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Analysis failed');

    jest.dontMock('../src/engines/schemaDiff');
  });

  test('GET /history (test mode)', async () => {
    const res = await request(app).get('/api/analysis/history');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.analyses)).toBe(true);
  });

});
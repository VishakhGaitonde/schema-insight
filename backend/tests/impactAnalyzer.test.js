process.env.NODE_ENV = 'test';

const { analyzeImpact } = require('../src/engines/impactAnalyzer');

describe('analyzeImpact', () => {
  test('detects introduced redundancy from added field', () => {
    const diff = { added: ['full_name'], removed: [], modified: [], renamed: [] };
    const r1 = [];
    const r2 = [{
      type: 'derived',
      fields: ['full_name', 'first_name', 'last_name'],
      severity: 'high',
      message: 'full_name can be derived',
    }];
    const result = analyzeImpact(diff, r1, r2);
    expect(result.insights[0].type).toBe('introduced');
    expect(result.redundancyScore).toBeGreaterThan(0);
  });

  test('detects eliminated redundancy from removed field', () => {
    const diff = { added: [], removed: ['full_name'], modified: [], renamed: [] };
    const r1 = [{
      type: 'derived',
      fields: ['full_name', 'first_name', 'last_name'],
      severity: 'high',
      message: 'full_name can be derived',
    }];
    const r2 = [];
    const result = analyzeImpact(diff, r1, r2);
    expect(result.insights[0].type).toBe('eliminated');
    expect(result.redundancyScore).toBe(0);
  });

  test('summary counts are correct', () => {
    const diff = { added: ['full_name'], removed: [], modified: [], renamed: [] };
    const r2 = [{
      type: 'derived',
      fields: ['full_name', 'first_name', 'last_name'],
      severity: 'high',
      message: 'test',
    }];
    const result = analyzeImpact(diff, [], r2);
    expect(result.summary.introduced).toBe(1);
    expect(result.summary.eliminated).toBe(0);
  });

  test('score does not exceed 100', () => {
    const diff = { added: ['a', 'b', 'c'], removed: [], modified: [], renamed: [] };
    const r2 = Array(10).fill({
      type: 'duplicate', fields: ['a', 'b'], severity: 'high', message: 'test'
    });
    const result = analyzeImpact(diff, [], r2);
    expect(result.redundancyScore).toBeLessThanOrEqual(100);
  });
});
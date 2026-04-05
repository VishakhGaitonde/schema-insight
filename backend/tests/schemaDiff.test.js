const { detectSchemaDiff } = require('../src/engines/schemaDiff');

describe('detectSchemaDiff', () => {
  test('detects added fields', () => {
    const v1 = { full_name: 'string', email: 'string' };
    const v2 = { first_name: 'string', last_name: 'string', email: 'string' };
    const result = detectSchemaDiff(v1, v2);
    expect(result.added).toContain('first_name');
    expect(result.added).toContain('last_name');
    expect(result.removed).toContain('full_name');
  });

  test('detects modified fields', () => {
    const v1 = { age: 'string' };
    const v2 = { age: 'number' };
    const result = detectSchemaDiff(v1, v2);
    expect(result.modified[0].field).toBe('age');
  });

  test('returns empty diff for identical schemas', () => {
    const v = { name: 'string' };
    const result = detectSchemaDiff(v, v);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.modified).toHaveLength(0);
  });
});
process.env.NODE_ENV = 'test';

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
    expect(result.modified[0].from).toBe('string');
    expect(result.modified[0].to).toBe('number');
  });

  test('returns empty diff for identical schemas', () => {
    const v = { name: 'string' };
    const result = detectSchemaDiff(v, v);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.modified).toHaveLength(0);
  });

  test('detects renamed fields', () => {
    const v1 = { username: 'string' };
    const v2 = { user_name: 'string' };
    const result = detectSchemaDiff(v1, v2);
    expect(result.renamed.length).toBeGreaterThan(0);
    expect(result.renamed[0].from).toBe('username');
  });

  test('handles empty schemas', () => {
    const result = detectSchemaDiff({}, {});
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
  });
});


test('schemaDiff handles identical schemas', () => {
  const schema = { a: 'string' };
  const result = detectSchemaDiff(schema, schema);

  expect(result.added.length).toBe(0);
  expect(result.removed.length).toBe(0);
});
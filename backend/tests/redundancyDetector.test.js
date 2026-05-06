process.env.NODE_ENV = 'test';

const { detectRedundancy } = require('../src/engines/redundancyDetector');

describe('detectRedundancy', () => {
  test('detects derived field', () => {
    const schema = { full_name: 'string', first_name: 'string', last_name: 'string' };
    const dataset = [
      { full_name: 'John Doe', first_name: 'John', last_name: 'Doe' },
      { full_name: 'Jane Smith', first_name: 'Jane', last_name: 'Smith' },
    ];
    const result = detectRedundancy(schema, dataset);
    const derived = result.find(r => r.type === 'derived');
    expect(derived).toBeDefined();
    expect(derived.fields).toContain('full_name');
  });

  test('detects duplicate fields', () => {
    const schema = { email: 'string', contact_email: 'string' };
    const dataset = [
      { email: 'a@b.com', contact_email: 'a@b.com' },
      { email: 'c@d.com', contact_email: 'c@d.com' },
    ];
    const result = detectRedundancy(schema, dataset);
    const dup = result.find(r => r.type === 'duplicate');
    expect(dup).toBeDefined();
  });

  test('detects same-prefix grouping', () => {
    const schema = { address_city: 'string', address_zip: 'string' };
    const dataset = [{ address_city: 'Bangalore', address_zip: '560001' }];
    const result = detectRedundancy(schema, dataset);
    const grouping = result.find(r => r.type === 'grouping');
    expect(grouping).toBeDefined();
    expect(grouping.fields).toContain('address_city');
  });

  test('detects constant field', () => {
    const schema = { country: 'string', name: 'string' };
    const dataset = [
      { country: 'India', name: 'Alice' },
      { country: 'India', name: 'Bob' },
    ];
    const result = detectRedundancy(schema, dataset);
    const constant = result.find(r => r.type === 'constant');
    expect(constant).toBeDefined();
    expect(constant.fields[0]).toBe('country');
  });

  test('returns empty for clean schema', () => {
    const schema = { first_name: 'string', email: 'string' };
    const dataset = [
      { first_name: 'Alice', email: 'alice@example.com' },
      { first_name: 'Bob', email: 'bob@example.com' },
    ];
    const result = detectRedundancy(schema, dataset);
    const highSeverity = result.filter(r => r.severity === 'high');
    expect(highSeverity).toHaveLength(0);
  });

  test('returns empty array for empty dataset', () => {
    const schema = { name: 'string' };
    const result = detectRedundancy(schema, []);
    expect(result).toHaveLength(0);
  });
});
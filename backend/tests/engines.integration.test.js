const { detectSchemaDiff } = require('../src/engines/schemaDiff');
const { detectRedundancy } = require('../src/engines/redundancyDetector');
const { analyzeImpact } = require('../src/engines/impactAnalyzer');

describe('Full engine chain integration', () => {
  const schemaV1 = { full_name: 'string', email: 'string' };
  const schemaV2 = {
    first_name: 'string', last_name: 'string',
    full_name: 'string', email: 'string', contact_email: 'string',
    address_city: 'string', address_country: 'string',
  };
  const dataset = [
    { full_name: 'John Doe', first_name: 'John', last_name: 'Doe', email: 'john@example.com', contact_email: 'john@example.com', address_city: 'Bangalore', address_country: 'India' },
    { full_name: 'Jane Smith', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', contact_email: 'jane@example.com', address_city: 'Mumbai', address_country: 'India' },
    { full_name: 'Alice Brown', first_name: 'Alice', last_name: 'Brown', email: 'alice@example.com', contact_email: 'alice@example.com', address_city: 'Delhi', address_country: 'India' },
  ];

  let diff, r1, r2, impact;

  beforeAll(() => {
    diff = detectSchemaDiff(schemaV1, schemaV2);
    r1 = detectRedundancy(schemaV1, dataset);
    r2 = detectRedundancy(schemaV2, dataset);
    impact = analyzeImpact(diff, r1, r2);
  });

  test('diff detects all added fields', () => {
    expect(diff.added).toContain('first_name');
    expect(diff.added).toContain('last_name');
    expect(diff.added).toContain('contact_email');
    expect(diff.added).toContain('address_city');
  });

  test('redundancy V2 has more issues than V1', () => {
    expect(r2.length).toBeGreaterThan(r1.length);
  });

  test('impact shows introduced redundancy', () => {
    const introduced = impact.insights.filter(i => i.type === 'introduced');
    expect(introduced.length).toBeGreaterThan(0);
  });

  test('impact score is higher after bad schema change', () => {
    expect(impact.redundancyScore).toBeGreaterThan(0);
  });

  test('recommendations are generated for introduced redundancy', () => {
    const withRec = impact.insights.filter(i => i.recommendation);
    expect(withRec.length).toBeGreaterThan(0);
  });

  test('summary counts match insights array', () => {
    const introduced = impact.insights.filter(i => i.type === 'introduced').length;
    const eliminated = impact.insights.filter(i => i.type === 'eliminated').length;
    expect(impact.summary.introduced).toBe(introduced);
    expect(impact.summary.eliminated).toBe(eliminated);
  });
});
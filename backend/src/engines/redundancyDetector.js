/**
 * Rule-based redundancy detection.
 * Checks for:
 *  1. Exact duplicate fields (same values across all rows)
 *  2. Derived fields (A = B + " " + C pattern)
 */
function detectRedundancy(schema, dataset) {
  const redundancies = [];
  const fields = Object.keys(schema);

  // Rule 1: duplicate values between two fields
  for (let i = 0; i < fields.length; i++) {
    for (let j = i + 1; j < fields.length; j++) {
      const a = fields[i], b = fields[j];
      const allSame = dataset.every(row => row[a] === row[b]);
      if (allSame && dataset.length > 0) {
        redundancies.push({
          type: 'duplicate',
          fields: [a, b],
          message: `"${a}" and "${b}" contain identical values in all rows`,
        });
      }
    }
  }

  // Rule 2: derived field (X = Y + " " + Z)
  for (const target of fields) {
    for (let i = 0; i < fields.length; i++) {
      for (let j = i + 1; j < fields.length; j++) {
        const a = fields[i], b = fields[j];
        if (a === target || b === target) continue;
        const allDerived = dataset.every(row =>
          row[target] === `${row[a]} ${row[b]}` ||
          row[target] === `${row[b]} ${row[a]}`
        );
        if (allDerived && dataset.length > 0) {
          redundancies.push({
            type: 'derived',
            fields: [target, a, b],
            message: `"${target}" can be derived from "${a}" + "${b}"`,
          });
        }
      }
    }
  }

  return redundancies;
}

module.exports = { detectRedundancy };
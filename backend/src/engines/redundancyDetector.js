/**
 * Rule-based redundancy detection.
 * Rule 1: Exact duplicate fields (same values across all rows)
 * Rule 2: Derived fields (A = B + " " + C)
 * Rule 3: Same-prefix fields (address_city, address_country → likely redundant grouping)
 * Rule 4: Constant fields (field has same value in every row — useless to store)
 */
function detectRedundancy(schema, dataset) {
  const redundancies = [];
  const fields = Object.keys(schema);

  if (!dataset || dataset.length === 0) return redundancies;

  // Rule 1: duplicate values between two fields
  for (let i = 0; i < fields.length; i++) {
    for (let j = i + 1; j < fields.length; j++) {
      const a = fields[i], b = fields[j];
      const allSame = dataset.every(row => row[a] !== undefined && row[a] === row[b]);
      if (allSame) {
        redundancies.push({
          type: 'duplicate',
          fields: [a, b],
          severity: 'high',
          message: `"${a}" and "${b}" contain identical values in every row`,
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
        if (allDerived) {
          redundancies.push({
            type: 'derived',
            fields: [target, a, b],
            severity: 'high',
            message: `"${target}" can be derived from "${a}" + "${b}"`,
          });
        }
      }
    }
  }

  // Rule 3: same-prefix fields (e.g. address_city, address_zip → group into object)
  const prefixMap = {};
  for (const field of fields) {
    const parts = field.split('_');
    if (parts.length > 1) {
      const prefix = parts[0];
      if (!prefixMap[prefix]) prefixMap[prefix] = [];
      prefixMap[prefix].push(field);
    }
  }
  for (const [prefix, group] of Object.entries(prefixMap)) {
    if (group.length >= 2) {
      redundancies.push({
        type: 'grouping',
        fields: group,
        severity: 'medium',
        message: `Fields ${group.map(f => `"${f}"`).join(', ')} share prefix "${prefix}" — consider grouping into a nested object`,
      });
    }
  }

  // Rule 4: constant field (same value in every row — no info gain)
  for (const field of fields) {
    const values = dataset.map(row => row[field]);
    const allSame = values.every(v => v === values[0]) && values[0] !== undefined;
    if (allSame && dataset.length > 1) {
      redundancies.push({
        type: 'constant',
        fields: [field],
        severity: 'low',
        message: `"${field}" has the same value ("${values[0]}") in every row — may be unnecessary to store`,
      });
    }
  }

  return redundancies;
}

module.exports = { detectRedundancy };
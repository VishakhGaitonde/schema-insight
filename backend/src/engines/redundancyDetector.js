function detectRedundancy(schema, dataset) {
  const redundancies = [];
  const fields = Object.keys(schema);

  if (!dataset || dataset.length === 0) return redundancies;

  // Rule 1: duplicate fields
  for (let i = 0; i < fields.length; i++) {
    for (let j = i + 1; j < fields.length; j++) {
      const a = fields[i], b = fields[j];
      const allSame = dataset.every(
        row => row[a] !== undefined && row[b] !== undefined && String(row[a]) === String(row[b])
      );
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

  // Rule 2: derived fields (X = Y + " " + Z)
  for (const target of fields) {
    for (let i = 0; i < fields.length; i++) {
      for (let j = i + 1; j < fields.length; j++) {
        const a = fields[i], b = fields[j];
        if (a === target || b === target) continue;
        const defined = dataset.filter(
          row => row[target] !== undefined && row[a] !== undefined && row[b] !== undefined
        );
        if (defined.length === 0) continue;
        const allDerived = defined.every(
          row =>
            String(row[target]) === `${row[a]} ${row[b]}` ||
            String(row[target]) === `${row[b]} ${row[a]}`
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

  // Rule 3: same-prefix grouping
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

  // Rule 4: constant fields
  for (const field of fields) {
    const values = dataset
      .map(row => row[field])
      .filter(v => v !== undefined && v !== null);
    if (values.length < 2) continue;
    const allSame = values.every(v => String(v) === String(values[0]));
    if (allSame) {
      redundancies.push({
        type: 'constant',
        fields: [field],
        severity: 'low',
        message: `"${field}" has the same value ("${values[0]}") in every row — may be unnecessary to store per row`,
      });
    }
  }

  // Deduplicate
  const seen = new Set();
  return redundancies.filter(r => {
    const key = `${r.type}-${r.fields.sort().join(',')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { detectRedundancy };
function detectSchemaDiff(v1, v2) {
  const added = [];
  const removed = [];
  const modified = [];
  const renamed = [];

  const flatV1 = _flatten(v1);
  const flatV2 = _flatten(v2);

  for (const key of Object.keys(flatV2)) {
    if (!(key in flatV1)) {
      added.push(key);
    } else if (flatV1[key] !== flatV2[key]) {
      modified.push({ field: key, from: flatV1[key], to: flatV2[key] });
    }
  }

  for (const key of Object.keys(flatV1)) {
    if (!(key in flatV2)) {
      removed.push(key);
    }
  }

  // Rename detection
  for (const rem of removed) {
    for (const add of added) {
      if (rem.includes(add) || add.includes(rem) || _similarity(rem, add) > 0.5) {
        renamed.push({ from: rem, to: add });
      }
    }
  }

  return { added, removed, modified, renamed };
}

// Flatten one level of nesting: { address: { city: 'string' } } → { address_city: 'string' }
function _flatten(schema, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(schema)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, _flatten(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function _similarity(a, b) {
  const setA = new Set(a.split(''));
  const setB = new Set(b.split(''));
  const intersection = [...setA].filter(c => setB.has(c)).length;
  return intersection / Math.max(setA.size, setB.size);
}

module.exports = { detectSchemaDiff };
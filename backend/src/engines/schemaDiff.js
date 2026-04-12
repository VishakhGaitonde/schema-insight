/**
 * Compares two flat/one-level JSON schemas.
 * Detects: added, removed, modified, renamed fields.
 */
function detectSchemaDiff(v1, v2) {
  const added = [];
  const removed = [];
  const modified = [];
  const renamed = [];

  for (const key of Object.keys(v2)) {
    if (!(key in v1)) {
      added.push(key);
    } else if (v1[key] !== v2[key]) {
      modified.push({ field: key, from: v1[key], to: v2[key] });
    }
  }

  for (const key of Object.keys(v1)) {
    if (!(key in v2)) {
      removed.push(key);
    }
  }

  // Rename detection: removed field + added field with shared substring
  for (const rem of removed) {
    for (const add of added) {
      if (
        rem.includes(add) || add.includes(rem) ||
        _similarity(rem, add) > 0.5
      ) {
        renamed.push({ from: rem, to: add });
      }
    }
  }

  return { added, removed, modified, renamed };
}

// Simple similarity: shared characters / max length
function _similarity(a, b) {
  const setA = new Set(a.split(''));
  const setB = new Set(b.split(''));
  const intersection = [...setA].filter(c => setB.has(c)).length;
  return intersection / Math.max(setA.size, setB.size);
}

module.exports = { detectSchemaDiff };
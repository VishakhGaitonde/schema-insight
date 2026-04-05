/**
 * Compares two flat/one-level JSON schemas.
 * Returns added, removed, modified fields.
 */
function detectSchemaDiff(v1, v2) {
  const added = [];
  const removed = [];
  const modified = [];

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

  return { added, removed, modified };
}

module.exports = { detectSchemaDiff };
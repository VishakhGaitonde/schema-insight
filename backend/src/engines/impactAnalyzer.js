/**
 * Links schema changes to redundancy changes.
 * Determines if a change introduced, removed, or transformed redundancy.
 */
function analyzeImpact(diff, redundanciesV1, redundanciesV2) {
  const insights = [];

  // Check if added fields introduced redundancy
  for (const addedField of diff.added) {
    const caused = redundanciesV2.filter(r => r.fields.includes(addedField));
    if (caused.length > 0) {
      caused.forEach(r => {
        insights.push({
          type: 'introduced',
          field: addedField,
          redundancy: r,
          message: `Adding "${addedField}" introduced redundancy: ${r.message}`,
          recommendation: buildRecommendation(r),
        });
      });
    }
  }

  // Check if removed fields eliminated redundancy
  for (const removedField of diff.removed) {
    const eliminated = redundanciesV1.filter(r => r.fields.includes(removedField));
    if (eliminated.length > 0) {
      eliminated.forEach(r => {
        insights.push({
          type: 'eliminated',
          field: removedField,
          redundancy: r,
          message: `Removing "${removedField}" eliminated redundancy: ${r.message}`,
        });
      });
    }
  }

  // Redundancy score (0–100)
  const score = Math.min(100, redundanciesV2.length * 25);

  return { insights, redundancyScore: score };
}

function buildRecommendation(redundancy) {
  if (redundancy.type === 'derived') {
    return `Remove "${redundancy.fields[0]}" and compute it dynamically from "${redundancy.fields[1]}" + "${redundancy.fields[2]}"`;
  }
  if (redundancy.type === 'duplicate') {
    return `Remove one of "${redundancy.fields[0]}" or "${redundancy.fields[1]}" — they carry the same data`;
  }
  return 'Consider normalizing the schema to remove this redundancy';
}

module.exports = { analyzeImpact };
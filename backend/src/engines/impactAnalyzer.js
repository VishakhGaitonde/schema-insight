function analyzeImpact(diff, redundanciesV1, redundanciesV2) {
  const insights = [];

  // Added fields that introduced redundancy
  for (const addedField of diff.added) {
    const caused = redundanciesV2.filter(r => r.fields.includes(addedField));
    caused.forEach(r => {
      insights.push({
        type: 'introduced',
        field: addedField,
        redundancy: r,
        severity: r.severity,
        message: `Adding "${addedField}" introduced redundancy: ${r.message}`,
        recommendation: buildRecommendation(r),
      });
    });
  }

  // Removed fields that eliminated redundancy
  for (const removedField of diff.removed) {
    const eliminated = redundanciesV1.filter(r => r.fields.includes(removedField));
    eliminated.forEach(r => {
      insights.push({
        type: 'eliminated',
        field: removedField,
        redundancy: r,
        severity: r.severity,
        message: `Removing "${removedField}" eliminated redundancy: ${r.message}`,
      });
    });
  }

  // Renamed fields
  for (const rename of diff.renamed) {
    insights.push({
      type: 'renamed',
      field: rename.from,
      severity: 'low',
      message: `"${rename.from}" appears to have been renamed to "${rename.to}" — verify data migration is complete`,
    });
  }

  // Severity-weighted redundancy score
  const severityWeight = { high: 40, medium: 20, low: 10 };
  const score = Math.min(
    100,
    redundanciesV2.reduce((sum, r) => sum + (severityWeight[r.severity] || 10), 0)
  );

  // Summary
  const summary = {
    totalRedundancies: redundanciesV2.length,
    introduced: insights.filter(i => i.type === 'introduced').length,
    eliminated: insights.filter(i => i.type === 'eliminated').length,
    renamed: insights.filter(i => i.type === 'renamed').length,
  };

  return { insights, redundancyScore: score, summary };
}

function buildRecommendation(redundancy) {
  if (redundancy.type === 'derived') {
    return `Remove "${redundancy.fields[0]}" and compute it dynamically from "${redundancy.fields[1]}" + "${redundancy.fields[2]}"`;
  }
  if (redundancy.type === 'duplicate') {
    return `Remove one of "${redundancy.fields[0]}" or "${redundancy.fields[1]}" — they carry identical data`;
  }
  if (redundancy.type === 'grouping') {
    return `Group ${redundancy.fields.map(f => `"${f}"`).join(', ')} into a nested object`;
  }
  if (redundancy.type === 'constant') {
    return `Move "${redundancy.fields[0]}" to a config or enum — no need to store it per row`;
  }
  return 'Consider normalizing the schema to remove this redundancy';
}

module.exports = { analyzeImpact };
const SEVERITY_COLOR = {
  high: { bg: '#fef2f2', text: '#dc2626', label: 'High' },
  medium: { bg: '#fffbeb', text: '#d97706', label: 'Medium' },
  low: { bg: '#f0fdf4', text: '#16a34a', label: 'Low' },
};

function SeverityBadge({ severity }) {
  const s = SEVERITY_COLOR[severity] || SEVERITY_COLOR.low;
  return (
    <span style={{
      background: s.bg, color: s.text,
      padding: '2px 8px', borderRadius: 12,
      fontSize: 11, fontWeight: 600, marginLeft: 8,
    }}>
      {s.label}
    </span>
  );
}

function SummaryCards({ summary, score }) {
  const scoreColor = score > 60 ? '#dc2626' : score > 30 ? '#d97706' : '#16a34a';
  const cards = [
    { label: 'Redundancy score', value: `${score}%`, color: scoreColor },
    { label: 'Total redundancies', value: summary.totalRedundancies, color: '#2563eb' },
    { label: 'Introduced', value: summary.introduced, color: '#dc2626' },
    { label: 'Eliminated', value: summary.eliminated, color: '#16a34a' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
      {cards.map((c, i) => (
        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{c.value}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function ReportView({ report }) {
  const { diff, redundanciesV1, redundanciesV2, impact } = report;

  return (
    <div style={{ marginTop: '2rem', display: 'grid', gap: '1.5rem' }}>

      <SummaryCards summary={impact.summary} score={impact.redundancyScore} />

      {/* Schema diff */}
      <section style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
        <h2 style={{ margin: '0 0 .75rem' }}>Schema diff</h2>
        <p><strong>Added:</strong> {diff.added.length ? diff.added.map(f => (
          <code key={f} style={{ background: '#f0fdf4', color: '#16a34a', padding: '1px 6px', borderRadius: 4, marginRight: 4 }}>{f}</code>
        )) : 'none'}</p>
        <p><strong>Removed:</strong> {diff.removed.length ? diff.removed.map(f => (
          <code key={f} style={{ background: '#fef2f2', color: '#dc2626', padding: '1px 6px', borderRadius: 4, marginRight: 4 }}>{f}</code>
        )) : 'none'}</p>
        <p><strong>Modified:</strong> {diff.modified.length
          ? diff.modified.map(m => `${m.field} (${m.from} → ${m.to})`).join(', ')
          : 'none'}
        </p>
        {diff.renamed.length > 0 && (
          <p><strong>Possibly renamed:</strong> {diff.renamed.map(r => (
            <span key={r.from} style={{ marginRight: 8 }}>
              <code style={{ background: '#fef9c3', padding: '1px 6px', borderRadius: 4 }}>{r.from} → {r.to}</code>
            </span>
          ))}</p>
        )}
      </section>

      {/* Redundancy report */}
      <section style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
        <h2 style={{ margin: '0 0 .75rem' }}>Redundancy report (V2 schema)</h2>
        {redundanciesV2.length === 0
          ? <p style={{ color: '#16a34a' }}>No redundancy detected.</p>
          : redundanciesV2.map((r, i) => (
            <div key={i} style={{
              background: SEVERITY_COLOR[r.severity]?.bg || '#f9fafb',
              borderRadius: 6, padding: '8px 12px', marginBottom: 8,
            }}>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{r.type}</span>
              <SeverityBadge severity={r.severity} />
              <p style={{ margin: '4px 0 0', fontSize: 14 }}>{r.message}</p>
            </div>
          ))
        }
      </section>

      {/* Impact analysis */}
      <section style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
        <h2 style={{ margin: '0 0 .75rem' }}>Impact analysis</h2>
        {impact.insights.length === 0
          ? <p>No direct impact detected between schema changes and redundancy.</p>
          : impact.insights.map((ins, i) => (
            <div key={i} style={{
              background: ins.type === 'introduced' ? '#fef2f2'
                : ins.type === 'eliminated' ? '#f0fdf4' : '#fefce8',
              borderRadius: 6, padding: '8px 12px', marginBottom: 8,
            }}>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{ins.type}</span>
              <SeverityBadge severity={ins.severity} />
              <p style={{ margin: '4px 0 0', fontSize: 14 }}>{ins.message}</p>
              {ins.recommendation && (
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#2563eb' }}>
                  💡 {ins.recommendation}
                </p>
              )}
            </div>
          ))
        }
      </section>

    </div>
  );
}
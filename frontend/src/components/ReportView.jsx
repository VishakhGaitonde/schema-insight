export default function ReportView({ report }) {
  const { diff, redundanciesV2, impact } = report;

  const scoreColor = impact.redundancyScore > 60 ? '#dc2626'
    : impact.redundancyScore > 30 ? '#d97706' : '#16a34a';

  return (
    <div style={{ marginTop: '2rem', display: 'grid', gap: '1.5rem' }}>

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
        <h2 style={{ margin: '0 0 .75rem' }}>Schema diff</h2>
        <p><strong>Added:</strong> {diff.added.length ? diff.added.join(', ') : 'none'}</p>
        <p><strong>Removed:</strong> {diff.removed.length ? diff.removed.join(', ') : 'none'}</p>
        <p><strong>Modified:</strong> {diff.modified.length
          ? diff.modified.map(m => `${m.field} (${m.from} → ${m.to})`).join(', ')
          : 'none'}
        </p>
      </section>

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
        <h2 style={{ margin: '0 0 .75rem' }}>
          Redundancy score:{' '}
          <span style={{ color: scoreColor }}>{impact.redundancyScore}%</span>
        </h2>
        {redundanciesV2.length === 0
          ? <p style={{ color: '#16a34a' }}>No redundancy detected in V2 schema.</p>
          : redundanciesV2.map((r, i) => (
            <div key={i} style={{ background: '#fef2f2', borderRadius: 6, padding: '8px 12px', marginBottom: 8 }}>
              <strong>{r.type}</strong>: {r.message}
            </div>
          ))
        }
      </section>

      <section style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' }}>
        <h2 style={{ margin: '0 0 .75rem' }}>Impact analysis</h2>
        {impact.insights.length === 0
          ? <p>No direct impact detected between schema changes and redundancy.</p>
          : impact.insights.map((ins, i) => (
            <div key={i} style={{
              background: ins.type === 'introduced' ? '#fef2f2' : '#f0fdf4',
              borderRadius: 6, padding: '8px 12px', marginBottom: 8,
            }}>
              <p style={{ margin: '0 0 4px' }}>{ins.message}</p>
              {ins.recommendation && (
                <p style={{ margin: 0, color: '#2563eb' }}>
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
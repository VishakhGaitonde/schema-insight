export default function HistoryPanel({ history, onSelect }) {
  if (history.length === 0) return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', background: '#fff', height: 'fit-content' }}>
      <h3 style={{ margin: '0 0 .5rem', fontSize: 14, color: '#6b7280' }}>Recent analyses</h3>
      <p style={{ fontSize: 13, color: '#9ca3af' }}>No analyses yet.</p>
    </div>
  );

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', background: '#fff', height: 'fit-content' }}>
      <h3 style={{ margin: '0 0 .75rem', fontSize: 14, color: '#6b7280' }}>Recent analyses</h3>
      {history.map((entry, i) => (
        <div
          key={i}
          onClick={() => onSelect(entry)}
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            marginBottom: 6,
            cursor: 'pointer',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 500 }}>Analysis #{history.length - i}</div>
          <div style={{ color: '#6b7280', fontSize: 12 }}>{entry.timestamp}</div>
          <div style={{ color: '#2563eb', fontSize: 12, marginTop: 2 }}>
            Score: {entry.result.impact.redundancyScore}%
          </div>
        </div>
      ))}
    </div>
  );
}
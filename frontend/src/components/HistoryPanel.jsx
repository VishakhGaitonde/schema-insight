export default function HistoryPanel({ history, onSelect, current }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      position: 'sticky',
      top: 72,
    }}>
      <div style={{
        padding: '0.875rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--mono)' }}>
          History
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          {history.length}/5
        </span>
      </div>

      {history.length === 0 ? (
        <div style={{ padding: '2rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.3 }}>◷</div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>No analyses yet</div>
        </div>
      ) : (
        <div style={{ padding: '0.5rem' }}>
          {history.map((entry, i) => {
            const score = entry.result.impact.redundancyScore;
            const isActive = current?.id === entry.id;
            const scoreColor = score > 60 ? 'var(--red)' : score > 30 ? 'var(--amber)' : 'var(--green)';
            return (
              <div
                key={entry.id}
                onClick={() => onSelect(entry)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 4,
                  cursor: 'pointer',
                  background: isActive ? 'rgba(79,110,247,0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(79,110,247,0.3)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg3)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                    run_{String(history.length - i).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor, fontFamily: 'var(--mono)' }}>
                    {score}%
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, fontFamily: 'var(--mono)' }}>
                  {entry.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
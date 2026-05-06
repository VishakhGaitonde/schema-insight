export default function Header() {
  return (
    <div style={{
      background: '#1e293b',
      color: '#fff',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{
        background: '#2563eb',
        borderRadius: 8,
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 18,
      }}>S</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>SchemaInsight</div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>Adaptive Schema Integrity Analyzer</div>
      </div>
    </div>
  );
}
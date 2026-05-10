export default function Header() {
  const linkStyle = {
    color: 'var(--text2)',
    textDecoration: 'none',
    fontSize: 13,
    transition: 'color 0.2s',
  };

  function handleEnter(e) {
    e.target.style.color = 'var(--text)';
  }

  function handleLeave(e) {
    e.target.style.color = 'var(--text2)';
  }

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: 'var(--accent-g)',
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'var(--mono)',
          }}
        >
          S
        </div>

        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '-0.01em',
          }}
        >
          SchemaInsight
        </span>

        <span
          style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '1px 7px',
            fontSize: 11,
            color: 'var(--text3)',
            fontFamily: 'var(--mono)',
          }}
        >
          MERN + DevSecOps
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <a
          href="https://github.com/VishakhGaitonde/schema-insight"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          GitHub
        </a>

        <a
          href="http://localhost:9090"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          Prometheus
        </a>

        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noreferrer"
          style={linkStyle}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          Grafana
        </a>
      </div>
    </header>
  );
}
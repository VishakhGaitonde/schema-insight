import { useState } from 'react';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import ReportView from './components/ReportView';
import HistoryPanel from './components/HistoryPanel';

export default function App() {
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [history, setHistory] = useState([]);

  function handleResult(result) {
    const entry = { result, timestamp: new Date().toLocaleTimeString(), id: Date.now() };
    setReport(entry);
    setHistory(prev => [entry, ...prev.slice(0, 4)]);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />

      {/* Hero */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '3rem 2rem 2.5rem',
        background: 'linear-gradient(180deg, rgba(79,110,247,0.05) 0%, transparent 100%)',
        textAlign: 'center',
      }}>
        <div className="fade-up" style={{
          display: 'inline-block',
          background: 'rgba(79,110,247,0.12)',
          border: '1px solid rgba(79,110,247,0.3)',
          borderRadius: 100,
          padding: '4px 14px',
          fontSize: 12,
          color: 'var(--accent2)',
          fontFamily: 'var(--mono)',
          marginBottom: '1rem',
          letterSpacing: '0.05em',
        }}>
          v1.0 — DevSecOps Project
        </div>
        <h1 className="fade-up fade-up-1" style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          background: 'linear-gradient(135deg, #fff 30%, var(--accent2))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.75rem',
        }}>
          Schema Insight
        </h1>
        <p className="fade-up fade-up-2" style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
          Detect how schema evolution introduces redundancy. Analyze. Score. Recommend.
        </p>
      </div>

      {/* Main layout */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        <div>
          <div className="fade-up fade-up-2">
            <UploadForm onResult={handleResult} onLoading={setLoading} onError={setError} />
          </div>

          {loading && <LoadingState />}
          {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
          {report && !loading && (
            <div className="fade-up">
              <ReportView report={report.result} />
            </div>
          )}
        </div>

        <div className="fade-up fade-up-3">
          <HistoryPanel history={history} onSelect={setReport} current={report} />
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{
      margin: '1.5rem 0',
      padding: '2rem',
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{
        width: 20, height: 20,
        border: '2px solid var(--border2)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Running analysis</div>
        <div style={{ color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--mono)' }}>
          diff → redundancy → impact → recommendations
        </div>
      </div>
    </div>
  );
}

function ErrorBanner({ message, onClose }) {
  return (
    <div style={{
      margin: '1rem 0',
      padding: '1rem 1.25rem',
      background: 'rgba(248,113,113,0.08)',
      border: '1px solid rgba(248,113,113,0.25)',
      borderRadius: 'var(--radius)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ color: 'var(--red)', fontSize: 14 }}>⚠ {message}</div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
    </div>
  );
}
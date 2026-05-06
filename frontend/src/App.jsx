import { useState } from 'react';
import UploadForm from './components/UploadForm';
import ReportView from './components/ReportView';
import Header from './components/Header';
import HistoryPanel from './components/HistoryPanel';

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  function handleResult(result, schemas) {
    const entry = { result, schemas, timestamp: new Date().toLocaleTimeString() };
    setReport(entry);
    setHistory(prev => [entry, ...prev.slice(0, 4)]);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          <div>
            <UploadForm
              onResult={handleResult}
              onLoading={setLoading}
              onError={setError}
            />
            {loading && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                Analyzing schema…
              </div>
            )}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '1rem', marginTop: '1rem', color: '#dc2626' }}>
                {error}
              </div>
            )}
            {report && <ReportView report={report.result} />}
          </div>
          <HistoryPanel history={history} onSelect={setReport} />
        </div>
      </div>
    </div>
  );
}
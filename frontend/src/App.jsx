import { useState } from 'react';
import UploadForm from './components/UploadForm';
import ReportView from './components/ReportView';

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: 4 }}>SchemaInsight</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Adaptive Schema Integrity Analyzer — detect how schema changes affect data redundancy
      </p>
      <UploadForm
        onResult={setReport}
        onLoading={setLoading}
        onError={setError}
      />
      {loading && <p>Analyzing…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {report && <ReportView report={report} />}
    </div>
  );
}
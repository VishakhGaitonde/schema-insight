import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EXAMPLE = {
  schemaV1: { full_name: 'string', email: 'string' },
  schemaV2: { first_name: 'string', last_name: 'string', full_name: 'string', email: 'string', contact_email: 'string' },
  dataset: [
    { full_name: 'John Doe', first_name: 'John', last_name: 'Doe', email: 'john@example.com', contact_email: 'john@example.com' },
    { full_name: 'Jane Smith', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', contact_email: 'jane@example.com' },
    { full_name: 'Alice Brown', first_name: 'Alice', last_name: 'Brown', email: 'alice@example.com', contact_email: 'alice@example.com' },
  ],
};

export default function UploadForm({ onResult, onLoading, onError }) {
  const [v1, setV1] = useState(JSON.stringify(EXAMPLE.schemaV1, null, 2));
  const [v2, setV2] = useState(JSON.stringify(EXAMPLE.schemaV2, null, 2));
  const [ds, setDs] = useState(JSON.stringify(EXAMPLE.dataset, null, 2));

  async function handleSubmit() {
    onError(null);
    onLoading(true);
    try {
      const schemaV1 = JSON.parse(v1);
      const schemaV2 = JSON.parse(v2);
      const dataset = JSON.parse(ds);
      const { data } = await axios.post(`${API}/api/analysis/analyze`, {
        schemaV1, schemaV2, dataset,
      });
      onResult(data.result, { schemaV1, schemaV2 });
    } catch (e) {
      if (e instanceof SyntaxError) {
        onError('Invalid JSON — check your schema or dataset format');
      } else {
        onError(e.response?.data?.error || 'Request failed');
      }
    } finally {
      onLoading(false);
    }
  }

  function handleReset() {
    setV1(JSON.stringify(EXAMPLE.schemaV1, null, 2));
    setV2(JSON.stringify(EXAMPLE.schemaV2, null, 2));
    setDs(JSON.stringify(EXAMPLE.dataset, null, 2));
  }

  const ta = {
    width: '100%',
    fontFamily: 'monospace',
    fontSize: 13,
    padding: '8px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    resize: 'vertical',
    boxSizing: 'border-box',
    background: '#fff',
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Input schemas</h2>
        <button onClick={handleReset} style={{ fontSize: 12, color: '#6b7280', background: 'none', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
          Reset to example
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ fontWeight: 500, fontSize: 14, display: 'block', marginBottom: 4 }}>
            Schema V1 <span style={{ color: '#dc2626', fontSize: 12 }}>(before)</span>
          </label>
          <textarea style={{ ...ta, height: 160 }} value={v1} onChange={e => setV1(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight: 500, fontSize: 14, display: 'block', marginBottom: 4 }}>
            Schema V2 <span style={{ color: '#16a34a', fontSize: 12 }}>(after)</span>
          </label>
          <textarea style={{ ...ta, height: 160 }} value={v2} onChange={e => setV2(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: 500, fontSize: 14, display: 'block', marginBottom: 4 }}>Dataset (JSON array)</label>
        <textarea style={{ ...ta, height: 120 }} value={ds} onChange={e => setDs(e.target.value)} />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: '10px 24px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        Analyze schema
      </button>
    </div>
  );
}
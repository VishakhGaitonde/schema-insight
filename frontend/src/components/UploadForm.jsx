import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EXAMPLE = {
  schemaV1: { full_name: 'string', email: 'string' },
  schemaV2: { first_name: 'string', last_name: 'string', email: 'string' },
  dataset: [
    { full_name: 'John Doe', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
    { full_name: 'Jane Smith', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
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
      const { data } = await axios.post(`${API}/api/analysis/analyze`, {
        schemaV1: JSON.parse(v1),
        schemaV2: JSON.parse(v2),
        dataset: JSON.parse(ds),
      });
      onResult(data.result);
    } catch (e) {
      onError(e.response?.data?.error || 'Request failed');
    } finally {
      onLoading(false);
    }
  }

  const ta = {
    width: '100%',
    fontFamily: 'monospace',
    fontSize: 13,
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: 6,
    resize: 'vertical',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ fontWeight: 500 }}>Schema V1 (before)</label>
          <textarea style={{ ...ta, height: 160 }} value={v1} onChange={e => setV1(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Schema V2 (after)</label>
          <textarea style={{ ...ta, height: 160 }} value={v2} onChange={e => setV2(e.target.value)} />
        </div>
      </div>
      <div>
        <label style={{ fontWeight: 500 }}>Dataset (JSON array)</label>
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
          width: 'fit-content',
        }}
      >
        Analyze schema
      </button>
    </div>
  );
}
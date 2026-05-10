import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EXAMPLE = {
  schemaV1: { full_name: 'string', email: 'string' },
  schemaV2: {
    first_name: 'string', last_name: 'string', full_name: 'string',
    email: 'string', contact_email: 'string',
    address_city: 'string', address_country: 'string', status: 'string',
  },
  dataset: [
    { full_name: 'John Doe', first_name: 'John', last_name: 'Doe', email: 'john@example.com', contact_email: 'john@example.com', address_city: 'Bangalore', address_country: 'India', status: 'active' },
    { full_name: 'Jane Smith', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', contact_email: 'jane@example.com', address_city: 'Mumbai', address_country: 'India', status: 'active' },
    { full_name: 'Alice Brown', first_name: 'Alice', last_name: 'Brown', email: 'alice@example.com', contact_email: 'alice@example.com', address_city: 'Delhi', address_country: 'India', status: 'active' },
  ],
};

const taBase = {
  width: '100%',
  fontFamily: 'var(--mono)',
  fontSize: 12,
  lineHeight: 1.6,
  padding: '12px 14px',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  resize: 'vertical',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s',
};

function Label({ children, hint }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--mono)' }}>
        {children}
      </span>
      {hint && <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{hint}</span>}
    </div>
  );
}

export default function UploadForm({ onResult, onLoading, onError }) {
  const [v1, setV1] = useState(JSON.stringify(EXAMPLE.schemaV1, null, 2));
  const [v2, setV2] = useState(JSON.stringify(EXAMPLE.schemaV2, null, 2));
  const [ds, setDs] = useState(JSON.stringify(EXAMPLE.dataset, null, 2));
  const [focusedField, setFocusedField] = useState(null);

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
      if (e instanceof SyntaxError) onError('Invalid JSON — check your schema or dataset');
      else onError(e.response?.data?.error || 'Request failed — is the backend running?');
    } finally {
      onLoading(false);
    }
  }

  function handleReset() {
    setV1(JSON.stringify(EXAMPLE.schemaV1, null, 2));
    setV2(JSON.stringify(EXAMPLE.schemaV2, null, 2));
    setDs(JSON.stringify(EXAMPLE.dataset, null, 2));
  }

  const getFocusStyle = (name) => focusedField === name
    ? { borderColor: 'rgba(79,110,247,0.5)', boxShadow: '0 0 0 3px rgba(79,110,247,0.08)' }
    : {};

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>Input</span>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>— schemas + dataset</span>
        </div>
        <button onClick={handleReset} style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 12px',
          fontSize: 12,
          color: 'var(--text2)',
          cursor: 'pointer',
          fontFamily: 'var(--mono)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)'; }}
        >
          reset_example()
        </button>
      </div>

      <div style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
        {/* Schema pair */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <Label hint="before change">schema_v1.json</Label>
            <textarea
              style={{ ...taBase, height: 180, ...getFocusStyle('v1') }}
              value={v1}
              onChange={e => setV1(e.target.value)}
              onFocus={() => setFocusedField('v1')}
              onBlur={() => setFocusedField(null)}
              spellCheck={false}
            />
          </div>
          <div>
            <Label hint="after change">schema_v2.json</Label>
            <textarea
              style={{ ...taBase, height: 180, ...getFocusStyle('v2') }}
              value={v2}
              onChange={e => setV2(e.target.value)}
              onFocus={() => setFocusedField('v2')}
              onBlur={() => setFocusedField(null)}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Dataset */}
        <div>
          <Label hint={`${JSON.parse(ds).length} rows`}>dataset.json</Label>
          <textarea
            style={{ ...taBase, height: 130, ...getFocusStyle('ds') }}
            value={ds}
            onChange={e => setDs(e.target.value)}
            onFocus={() => setFocusedField('ds')}
            onBlur={() => setFocusedField(null)}
            spellCheck={false}
          />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} style={{
          padding: '12px 24px',
          background: 'var(--accent-g)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'var(--sans)',
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          transition: 'opacity 0.2s, transform 0.1s',
          width: 'fit-content',
        }}
          onMouseEnter={e => e.target.style.opacity = '0.88'}
          onMouseLeave={e => e.target.style.opacity = '1'}
          onMouseDown={e => e.target.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.target.style.transform = 'scale(1)'}
        >
          Run analysis →
        </button>
      </div>
    </div>
  );
}
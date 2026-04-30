import { RadialBarChart, RadialBar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const SEVERITY_COLOR = {
  high:   { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', label: 'High' },
  medium: { bg: '#fffbeb', border: '#fde68a', text: '#d97706', label: 'Medium' },
  low:    { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a', label: 'Low' },
};

const TYPE_COLOR = {
  introduced: { bg: '#fef2f2', border: '#fecaca', icon: '↑' },
  eliminated: { bg: '#f0fdf4', border: '#bbf7d0', icon: '↓' },
  renamed:    { bg: '#fefce8', border: '#fde68a', icon: '→' },
};

function SeverityBadge({ severity }) {
  const s = SEVERITY_COLOR[severity] || SEVERITY_COLOR.low;
  return (
    <span style={{
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      padding: '2px 8px', borderRadius: 12,
      fontSize: 11, fontWeight: 600, marginLeft: 8,
    }}>
      {s.label}
    </span>
  );
}

function ScoreGauge({ score }) {
  const color = score > 60 ? '#dc2626' : score > 30 ? '#d97706' : '#16a34a';
  const data = [{ value: score }, { value: 100 - score }];
  return (
    <div style={{ textAlign: 'center' }}>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="85%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: -60, fontSize: 32, fontWeight: 700, color }}>{score}%</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Redundancy score</div>
    </div>
  );
}

function SummaryCards({ summary, score }) {
  const cards = [
    { label: 'Total redundancies', value: summary.totalRedundancies, color: '#2563eb' },
    { label: 'Introduced', value: summary.introduced, color: '#dc2626' },
    { label: 'Eliminated', value: summary.eliminated, color: '#16a34a' },
    { label: 'Renamed fields', value: summary.renamed, color: '#d97706' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      {cards.map((c, i) => (
        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', textAlign: 'center', background: '#fff' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: c.color }}>{c.value}</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

function SchemaDiff({ diff }) {
  return (
    <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.5rem' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: 16 }}>Schema diff</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Removed fields</div>
          {diff.removed.length === 0
            ? <span style={{ fontSize: 13, color: '#9ca3af' }}>None</span>
            : diff.removed.map(f => (
              <span key={f} style={{ display: 'inline-block', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: 4, marginRight: 4, marginBottom: 4, fontSize: 13, fontFamily: 'monospace' }}>
                − {f}
              </span>
            ))
          }
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Added fields</div>
          {diff.added.length === 0
            ? <span style={{ fontSize: 13, color: '#9ca3af' }}>None</span>
            : diff.added.map(f => (
              <span key={f} style={{ display: 'inline-block', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 4, marginRight: 4, marginBottom: 4, fontSize: 13, fontFamily: 'monospace' }}>
                + {f}
              </span>
            ))
          }
        </div>
      </div>
      {diff.modified.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Modified fields</div>
          {diff.modified.map(m => (
            <span key={m.field} style={{ display: 'inline-block', background: '#fefce8', color: '#d97706', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 4, marginRight: 4, fontSize: 13, fontFamily: 'monospace' }}>
              {m.field}: {m.from} → {m.to}
            </span>
          ))}
        </div>
      )}
      {diff.renamed.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Possibly renamed</div>
          {diff.renamed.map(r => (
            <span key={r.from} style={{ display: 'inline-block', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', padding: '2px 8px', borderRadius: 4, marginRight: 4, fontSize: 13, fontFamily: 'monospace' }}>
              {r.from} → {r.to}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function RedundancyReport({ redundancies }) {
  return (
    <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.5rem' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: 16 }}>Redundancy report</h2>
      {redundancies.length === 0
        ? <p style={{ color: '#16a34a', margin: 0 }}>No redundancy detected in V2 schema.</p>
        : redundancies.map((r, i) => {
          const s = SEVERITY_COLOR[r.severity] || SEVERITY_COLOR.low;
          return (
            <div key={i} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: 6, padding: '10px 14px', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 14 }}>{r.type}</span>
                <SeverityBadge severity={r.severity} />
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>{r.message}</div>
              <div style={{ marginTop: 4 }}>
                {r.fields.map(f => (
                  <code key={f} style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: 3, fontSize: 12, marginRight: 4 }}>{f}</code>
                ))}
              </div>
            </div>
          );
        })
      }
    </section>
  );
}

function ImpactAnalysis({ insights }) {
  return (
    <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.5rem' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: 16 }}>Impact analysis</h2>
      {insights.length === 0
        ? <p style={{ margin: 0, color: '#6b7280' }}>No direct impact detected between schema changes and redundancy.</p>
        : insights.map((ins, i) => {
          const t = TYPE_COLOR[ins.type] || TYPE_COLOR.introduced;
          return (
            <div key={i} style={{
              background: t.bg, border: `1px solid ${t.border}`,
              borderRadius: 6, padding: '10px 14px', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 14 }}>
                  {t.icon} {ins.type}
                </span>
                {ins.severity && <SeverityBadge severity={ins.severity} />}
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>{ins.message}</div>
              {ins.recommendation && (
                <div style={{ marginTop: 6, padding: '6px 10px', background: '#eff6ff', borderRadius: 4, fontSize: 13, color: '#2563eb' }}>
                  💡 {ins.recommendation}
                </div>
              )}
            </div>
          );
        })
      }
    </section>
  );
}

function RecommendationCards({ insights }) {
  const recs = insights.filter(i => i.recommendation);
  if (recs.length === 0) return null;
  return (
    <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.5rem' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: 16 }}>Recommended schema improvements</h2>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {recs.map((ins, i) => (
          <div key={i} style={{
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 8, padding: '12px 16px',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <div style={{ background: '#2563eb', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 2 }}>
                Field: <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: 3 }}>{ins.field}</code>
              </div>
              <div style={{ fontSize: 13, color: '#1e3a8a' }}>{ins.recommendation}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ReportView({ report }) {
  const { diff, redundanciesV1, redundanciesV2, impact } = report;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.5rem' }}>
        <ScoreGauge score={impact.redundancyScore} />
        <SummaryCards summary={impact.summary} score={impact.redundancyScore} />
      </div>

      <SchemaDiff diff={diff} />
      <RedundancyReport redundancies={redundanciesV2} />
      <ImpactAnalysis insights={impact.insights} />
      <RecommendationCards insights={impact.insights} />

    </div>
  );
}
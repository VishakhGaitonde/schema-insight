import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const SEV = {
  high:   { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', label: 'HIGH' },
  medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',  label: 'MED' },
  low:    { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',  label: 'LOW' },
};

const TYPE_ICON = { duplicate: '⊕', derived: '⊃', grouping: '⊞', constant: '⊝' };

function SevBadge({ severity }) {
  const s = SEV[severity] || SEV.low;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 3, padding: '1px 6px',
      fontFamily: 'var(--mono)',
    }}>{s.label}</span>
  );
}

function Card({ children, style = {}, className = '' }) {
  return (
    <div className={className} style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ dot, dotColor = 'var(--accent)', title, sub, right }) {
  return (
    <div style={{
      padding: '1rem 1.5rem',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, boxShadow: `0 0 8px ${dotColor}` }} />
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
        {sub && <span style={{ color: 'var(--text3)', fontSize: 13 }}>— {sub}</span>}
      </div>
      {right}
    </div>
  );
}

function ScoreGauge({ score }) {
  const color = score > 60 ? '#f87171' : score > 30 ? '#fbbf24' : '#34d399';
  const data = [{ value: score }, { value: 100 - score }];
  return (
    <div style={{ position: 'relative', width: 160, margin: '0 auto' }}>
      <ResponsiveContainer width={160} height={100}>
        <PieChart>
          <Pie data={data} cx="50%" cy="90%" startAngle={180} endAngle={0}
            innerRadius={52} outerRadius={68} dataKey="value" strokeWidth={0}>
            <Cell fill={color} />
            <Cell fill="var(--bg3)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--mono)', lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>score</div>
      </div>
    </div>
  );
}

function StatBox({ value, label, color = 'var(--text)' }) {
  return (
    <div style={{
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '1rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'var(--mono)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
    </div>
  );
}

function FieldTag({ name, type = 'neutral' }) {
  const styles = {
    added:   { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  color: '#34d399', prefix: '+' },
    removed: { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', color: '#f87171', prefix: '−' },
    modified:{ bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)',  color: '#fbbf24', prefix: '~' },
    renamed: { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', color: '#a78bfa', prefix: '→' },
    neutral: { bg: 'var(--bg3)', border: 'var(--border)', color: 'var(--text2)', prefix: '' },
  };
  const s = styles[type] || styles.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 4, padding: '2px 8px',
      fontSize: 12, color: s.color, fontFamily: 'var(--mono)',
      marginRight: 4, marginBottom: 4,
    }}>
      {s.prefix && <span style={{ opacity: 0.7 }}>{s.prefix}</span>}
      {name}
    </span>
  );
}

const customTooltipStyle = {
  background: 'var(--bg3)',
  border: '1px solid var(--border2)',
  borderRadius: 6,
  fontSize: 12,
  fontFamily: 'var(--mono)',
  color: 'var(--text)',
};

export default function ReportView({ report }) {
  const { diff, redundanciesV1 = [], redundanciesV2 = [], impact } = report;
  const { insights, redundancyScore, summary } = impact;

  const barData = ['duplicate', 'derived', 'grouping', 'constant'].map(type => ({
    name: type,
    V1: redundanciesV1.filter(r => r.type === type).length,
    V2: redundanciesV2.filter(r => r.type === type).length,
  }));

  const scoreColor = redundancyScore > 60 ? '#f87171' : redundancyScore > 30 ? '#fbbf24' : '#34d399';

  return (
    <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>

      {/* Score + Stats row */}
      <Card className="fade-up">
        <CardHeader
          title="Analysis result"
          sub="redundancy impact report"
          dotColor="var(--green)"
          right={
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>
              {new Date().toLocaleTimeString()}
            </span>
          }
        />
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <ScoreGauge score={redundancyScore} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            <StatBox value={summary.totalRedundancies} label="Total issues" color="var(--accent2)" />
            <StatBox value={summary.introduced} label="Introduced" color="#f87171" />
            <StatBox value={summary.eliminated} label="Eliminated" color="#34d399" />
            <StatBox value={summary.renamed} label="Renamed" color="#a78bfa" />
          </div>
        </div>
      </Card>

      {/* Schema diff */}
      <Card className="fade-up fade-up-1">
        <CardHeader title="Schema diff" sub="structural changes detected" dotColor="var(--amber)" />
        <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          {diff.added.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Added</div>
              <div>{diff.added.map(f => <FieldTag key={f} name={f} type="added" />)}</div>
            </div>
          )}
          {diff.removed.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Removed</div>
              <div>{diff.removed.map(f => <FieldTag key={f} name={f} type="removed" />)}</div>
            </div>
          )}
          {diff.modified.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Modified</div>
              <div>{diff.modified.map(m => <FieldTag key={m.field} name={`${m.field}: ${m.from}→${m.to}`} type="modified" />)}</div>
            </div>
          )}
          {diff.renamed.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Possibly renamed</div>
              <div>{diff.renamed.map(r => <FieldTag key={r.from} name={`${r.from} → ${r.to}`} type="renamed" />)}</div>
            </div>
          )}
          {diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0 && (
            <div style={{ color: 'var(--text3)', fontSize: 14, fontFamily: 'var(--mono)' }}>// No structural changes detected</div>
          )}
        </div>
      </Card>

      {/* Redundancy breakdown chart */}
      <Card className="fade-up fade-up-2">
        <CardHeader title="Redundancy breakdown" sub="V1 vs V2 comparison" dotColor="var(--accent)" />
        <div style={{ padding: '1.5rem' }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: 'var(--text3)', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }} />
              <Bar dataKey="V1" fill="rgba(255,255,255,0.15)" name="before" radius={[3,3,0,0]} />
              <Bar dataKey="V2" fill="var(--accent)" name="after" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Redundancy report */}
      <Card className="fade-up fade-up-3">
        <CardHeader title="Redundancy report" sub={`${redundanciesV2.length} issues in V2`} dotColor="#f87171" />
        <div style={{ padding: '1rem 1.5rem' }}>
          {redundanciesV2.length === 0 ? (
            <div style={{ color: '#34d399', fontFamily: 'var(--mono)', fontSize: 13, padding: '0.5rem 0' }}>
              ✓ No redundancy detected in V2 schema
            </div>
          ) : redundanciesV2.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
              padding: '12px 0',
              borderBottom: i < redundanciesV2.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: SEV[r.severity]?.bg || 'var(--bg3)',
                border: `1px solid ${SEV[r.severity]?.border || 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>
                {TYPE_ICON[r.type] || '⊙'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>{r.type}</span>
                  <SevBadge severity={r.severity} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{r.message}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {r.fields.map(f => (
                    <span key={f} style={{
                      fontSize: 11, fontFamily: 'var(--mono)',
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                      borderRadius: 3, padding: '1px 6px', marginRight: 4, marginBottom: 4,
                      color: 'var(--text2)',
                    }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Impact analysis */}
      <Card className="fade-up fade-up-4">
        <CardHeader title="Impact analysis" sub="schema change → redundancy link" dotColor="#a78bfa" />
        <div style={{ padding: '1rem 1.5rem' }}>
          {insights.length === 0 ? (
            <div style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 13, padding: '0.5rem 0' }}>
              // No direct impact detected
            </div>
          ) : insights.map((ins, i) => {
            const typeColor = ins.type === 'introduced' ? '#f87171' : ins.type === 'eliminated' ? '#34d399' : '#a78bfa';
            return (
              <div key={i} style={{
                padding: '12px 0',
                borderBottom: i < insights.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                    color: typeColor, background: `${typeColor}18`,
                    border: `1px solid ${typeColor}40`,
                    borderRadius: 3, padding: '1px 7px',
                    fontFamily: 'var(--mono)', textTransform: 'uppercase',
                  }}>{ins.type}</span>
                  {ins.severity && <SevBadge severity={ins.severity} />}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text3)' }}>
                    field: {ins.field}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: ins.recommendation ? 8 : 0 }}>
                  {ins.message}
                </div>
                {ins.recommendation && (
                  <div style={{
                    background: 'rgba(79,110,247,0.06)',
                    border: '1px solid rgba(79,110,247,0.2)',
                    borderRadius: 6, padding: '8px 12px',
                    fontSize: 13, color: 'var(--accent2)',
                    fontFamily: 'var(--mono)',
                  }}>
                    → {ins.recommendation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recommendations */}
      {insights.filter(i => i.recommendation).length > 0 && (
        <Card className="fade-up fade-up-5">
          <CardHeader title="Recommendations" sub="suggested schema improvements" dotColor="#34d399" />
          <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gap: '0.75rem' }}>
            {insights.filter(i => i.recommendation).map((ins, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: 'var(--accent-g)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fff',
                  fontFamily: 'var(--mono)', flexShrink: 0,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>
                    field: <span style={{ color: 'var(--accent2)' }}>{ins.field}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{ins.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
}
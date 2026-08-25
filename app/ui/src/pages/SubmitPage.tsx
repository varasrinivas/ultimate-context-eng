import { useMemo, useState } from 'react';
import { evaluate } from '../lib/scoring';
import { StatusPill } from '../components/domain/StatusPill';
import '../components/layout/layout.css';

// Static copies of the seed procedures/members for instant client-side preview;
// the real submission path is a backend concern (and a course lab).
const PROCEDURES = [
  { code: '72148', name: 'MRI Lumbar Spine', tier: 'diagnostics' as const, criteria: [
    { id: 'C-72148-1', name: 'Conservative therapy >= 6 weeks documented', weight: 40 },
    { id: 'C-72148-2', name: 'Neurological deficit present', weight: 35 },
    { id: 'C-72148-3', name: 'No MRI of same region in past 12 months', weight: 25 },
  ]},
  { code: '29881', name: 'Knee Arthroscopy with Meniscectomy', tier: 'surgical' as const, criteria: [
    { id: 'C-29881-1', name: 'MRI-confirmed meniscal tear', weight: 45 },
    { id: 'C-29881-2', name: 'Failed 12 weeks conservative management', weight: 35 },
    { id: 'C-29881-3', name: 'Mechanical symptoms (locking or catching)', weight: 20 },
  ]},
  { code: '95810', name: 'Polysomnography (Sleep Study)', tier: 'diagnostics' as const, criteria: [
    { id: 'C-95810-1', name: 'Epworth Sleepiness Scale >= 10', weight: 50 },
    { id: 'C-95810-2', name: 'Witnessed apneas or BMI >= 35', weight: 30 },
    { id: 'C-95810-3', name: 'No prior positive home sleep test', weight: 20 },
  ]},
];

const MEMBERS = [
  { id: 'M-2001', name: 'Rosa Delgado', tier: 'PREMIUM' as const, status: 'ACTIVE' as const },
  { id: 'M-2002', name: 'James Okafor', tier: 'STANDARD' as const, status: 'ACTIVE' as const },
  { id: 'M-2004', name: 'Dale Whitfield', tier: 'STANDARD' as const, status: 'LAPSED' as const },
  { id: 'M-2006', name: 'Marcus Bell', tier: 'PREMIUM' as const, status: 'ACTIVE' as const },
];

export function SubmitPage() {
  const [memberId, setMemberId] = useState(MEMBERS[0].id);
  const [procCode, setProcCode] = useState(PROCEDURES[0].code);
  const [met, setMet] = useState<Set<string>>(new Set());

  const member = MEMBERS.find((m) => m.id === memberId)!;
  const proc = PROCEDURES.find((p) => p.code === procCode)!;

  const result = useMemo(() => evaluate({
    planStatus: member.status,
    planTier: member.tier,
    procedureTier: proc.tier,
    criteria: proc.criteria.map((c) => ({ ...c, met: met.has(c.id) })),
  }), [member, proc, met]);

  function toggle(id: string) {
    setMet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">new request</span>
        <h1>Submit a prior-auth request</h1>
        <p className="muted small">The expected determination updates as you type — same rule the backend applies (see bench/seed/dataset.json).</p>
      </div>

      <div className="detail-grid">
        <div className="card panel form-grid">
          <div>
            <label htmlFor="member">Member</label>
            <select id="member" value={memberId} onChange={(e) => { setMemberId(e.target.value); }}>
              {MEMBERS.map((m) => (
                <option key={m.id} value={m.id}>{m.id} · {m.name} ({m.tier}, {m.status})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="proc">Procedure</label>
            <select id="proc" value={procCode} onChange={(e) => { setProcCode(e.target.value); setMet(new Set()); }}>
              {PROCEDURES.map((p) => (
                <option key={p.code} value={p.code}>{p.code} · {p.name}</option>
              ))}
            </select>
          </div>
          <fieldset style={{ border: 'none' }}>
            <legend className="eyebrow" style={{ marginBottom: 6 }}>Clinical criteria met</legend>
            {proc.criteria.map((c) => (
              <label key={c.id} className="check-row">
                <input type="checkbox" checked={met.has(c.id)} onChange={() => toggle(c.id)} />
                <span>{c.name} <span className="mono muted small">+{c.weight}</span></span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="card panel">
          <h2>Expected determination</h2>
          <div className="decision-banner" style={{ marginTop: 8 }}>
            <StatusPill decision={result.decision} />
            <span className="mono">score {result.score}</span>
          </div>
          {!result.eligible && <p className="small">{result.eligibilityReason}.</p>}
          {result.eligible && result.missing.length > 0 && (
            <p className="small muted">Missing: {result.missing.join('; ')}</p>
          )}
          <p className="small muted" style={{ marginTop: 10 }}>
            Thresholds: approve at ≥ 80, review at ≥ 50 — the canonical values the copilot's
            <code> okf</code> mode reads from concept files.
          </p>
        </div>
      </div>
    </div>
  );
}

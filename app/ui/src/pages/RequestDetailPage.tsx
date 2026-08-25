import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { StatusPill } from '../components/domain/StatusPill';
import { ScoreBar } from '../components/domain/ScoreBar';
import '../components/layout/layout.css';

export function RequestDetailPage() {
  const { id = '' } = useParams();
  const { data: r, loading, error } = useApi(() => api.getRequest(id), [id]);

  if (loading) return <Spinner label={`Loading ${id}`} />;
  if (error) return <ErrorState message={error} />;
  if (!r) return null;

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">determination</span>
        <h1 className="mono">{r.id}</h1>
      </div>

      <div className="decision-banner">
        <StatusPill decision={r.decision} />
        <span className="small muted">{r.reason}</span>
      </div>

      <div className="detail-grid">
        <div className="card panel">
          <h2>Criteria scoring</h2>
          <ScoreBar criteria={r.criteria} score={r.score} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card panel">
            <h2>Request</h2>
            <dl className="kv">
              <dt>Member</dt>
              <dd><Link to={`/members/${r.memberId}`}>{r.memberName}</Link> <span className="mono muted small">{r.memberId}</span></dd>
              <dt>Provider</dt><dd>{r.providerName}</dd>
              <dt>Procedure</dt><dd>{r.procedureName} <span className="mono muted small">{r.procedureCode}</span></dd>
            </dl>
          </div>
          <div className="card panel">
            <h2>Clinical notes</h2>
            {r.notes.length === 0 && <p className="small muted">No notes on this request.</p>}
            {r.notes.map((n, i) => (
              <p key={i} className="small" style={{ marginBottom: 8 }}>
                <strong>{n.author}:</strong> {n.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

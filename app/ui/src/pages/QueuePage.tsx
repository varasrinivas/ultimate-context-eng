import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusPill } from '../components/domain/StatusPill';
import '../components/layout/layout.css';
import '../components/ui/primitives.css';

export function QueuePage() {
  const { data, loading, error } = useApi(() => api.getQueue(), []);

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">work queue</span>
        <h1>Manual review</h1>
        <p className="muted small">Requests that scored between the review and approval thresholds — a clinician decides.</p>
      </div>
      {loading && <Spinner label="Loading queue" />}
      {error && <ErrorState message={error} />}
      {data && data.length === 0 && <EmptyState title="Queue is clear" hint="No requests need manual review right now." />}
      {data && data.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr><th>Request</th><th>Member</th><th>Procedure</th><th>Score</th><th>Missing criteria</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id}>
                  <td><Link to={`/requests/${r.id}`} className="mono">{r.id}</Link></td>
                  <td>{r.memberName} <span className="muted mono small">{r.memberId}</span></td>
                  <td>{r.procedureName} <span className="muted mono small">{r.procedureCode}</span></td>
                  <td className="mono">{r.score}</td>
                  <td>
                    {r.missingCriteria.map((c) => (
                      <span key={c} className="chip chip-missing" style={{ marginRight: 4 }}>{c}</span>
                    ))}
                  </td>
                  <td><StatusPill decision={r.decision} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

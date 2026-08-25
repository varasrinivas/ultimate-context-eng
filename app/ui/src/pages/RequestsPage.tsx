import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { StatusPill } from '../components/domain/StatusPill';
import '../components/layout/layout.css';

export function RequestsPage() {
  const { data, loading, error } = useApi(() => api.getRequests(), []);
  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">all determinations</span>
        <h1>Authorization requests</h1>
      </div>
      {loading && <Spinner label="Loading requests" />}
      {error && <ErrorState message={error} />}
      {data && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr><th>Request</th><th>Member</th><th>Procedure</th><th>Score</th><th>Decision</th></tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.id}>
                  <td><Link to={`/requests/${r.id}`} className="mono">{r.id}</Link></td>
                  <td>{r.memberName}</td>
                  <td>{r.procedureName}</td>
                  <td className="mono">{r.score}</td>
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

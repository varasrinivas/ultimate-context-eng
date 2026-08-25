import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { StatusPill } from '../components/domain/StatusPill';
import { RedactedBadge } from '../components/domain/RedactedBadge';
import type { Decision } from '../types';
import '../components/layout/layout.css';

export function MembersPage() {
  const { data, loading, error } = useApi(() => api.getMembers(), []);
  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">plan members</span>
        <h1>Member lookup</h1>
      </div>
      {loading && <Spinner label="Loading members" />}
      {error && <ErrorState message={error} />}
      {data && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>DOB</th></tr></thead>
            <tbody>
              {data.map((m) => (
                <tr key={m.id}>
                  <td><Link to={`/members/${m.id}`} className="mono">{m.id}</Link> {m.name}</td>
                  <td className="mono">{m.planTier}</td>
                  <td className="mono">{m.planStatus}</td>
                  <td className="mono">{m.dob === '_redacted' ? <RedactedBadge /> : m.dob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function MemberDetailPage() {
  const { id = '' } = useParams();
  const { data: m, loading, error } = useApi(() => api.getMember(id), [id]);

  if (loading) return <Spinner label={`Loading ${id}`} />;
  if (error) return <ErrorState message={error} />;
  if (!m) return null;

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">member</span>
        <h1>{m.name} <span className="mono muted">{m.id}</span></h1>
      </div>
      <div className="detail-grid">
        <div className="card panel">
          <h2>Authorization history</h2>
          {m.history.length === 0 && <p className="small muted">No requests yet.</p>}
          {m.history.map((h) => (
            <div key={h.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
              <Link to={`/requests/${h.id}`} className="mono small">{h.id}</Link>
              <span className="small" style={{ flex: 1 }}>{h.procedureName}</span>
              <StatusPill decision={h.decision as Decision} />
            </div>
          ))}
        </div>
        <div className="card panel">
          <h2>Plan</h2>
          <dl className="kv">
            <dt>Tier</dt><dd className="mono">{m.planTier}</dd>
            <dt>Status</dt><dd className="mono">{m.planStatus}</dd>
            <dt>Date of birth</dt>
            <dd>{m.dob === '_redacted' ? <RedactedBadge /> : <span className="mono">{m.dob}</span>}</dd>
          </dl>
          {m.dob === '_redacted' && (
            <p className="small muted" style={{ marginTop: 10 }}>
              PHI-minimized field. Try asking the copilot for it — the abstention gate is module U08's lab.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

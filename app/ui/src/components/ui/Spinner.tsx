import './primitives.css';

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="state-box" role="status" aria-label={label}>
      <div className="spinner" />
      <span className="small">{label}…</span>
    </div>
  );
}

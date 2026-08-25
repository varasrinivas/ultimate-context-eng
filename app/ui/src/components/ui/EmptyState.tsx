import './primitives.css';

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="state-box">
      <span className="title">{title}</span>
      <span className="small">{hint}</span>
    </div>
  );
}

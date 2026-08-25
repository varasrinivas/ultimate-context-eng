import '../ui/primitives.css';

export function RedactedBadge() {
  return (
    <span className="redacted-badge" title="PHI-minimized field — the copilot must refuse to state it">
      <span aria-hidden="true">▮▮</span> REDACTED
    </span>
  );
}

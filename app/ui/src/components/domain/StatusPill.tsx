import type { Decision } from '../../types';
import '../ui/primitives.css';

// Status colors never carry meaning alone: each pill pairs an icon glyph with
// its label (dataviz status rule).
const META: Record<Decision, { cls: string; icon: string; label: string }> = {
  APPROVED: { cls: 'pill-approved', icon: '✓', label: 'Approved' },
  MANUAL_REVIEW: { cls: 'pill-review', icon: '⚠', label: 'Manual review' },
  DENIED: { cls: 'pill-denied', icon: '✕', label: 'Denied' },
};

export function StatusPill({ decision }: { decision: Decision }) {
  const m = META[decision];
  return (
    <span className={`pill ${m.cls}`}>
      <span aria-hidden="true">{m.icon}</span>
      {m.label}
    </span>
  );
}

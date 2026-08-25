import type { Correctness } from '../../types';
import './lens.css';

export function CorrectnessBadge({ correctness }: { correctness: Correctness }) {
  if (!correctness.graded) {
    return (
      <span className="correctness ungraded" title="Free-form question — no answer key to grade against">
        <span aria-hidden="true">–</span> Ungraded
      </span>
    );
  }
  if (correctness.verdict === 'PASS') {
    return (
      <span className="correctness pass" title="All key facts present, no forbidden content">
        <span aria-hidden="true">✓</span> Correct
      </span>
    );
  }
  const parts = [
    ...correctness.missingFacts.map((f) => `missing: ${f}`),
    ...correctness.forbiddenHits.map((f) => `forbidden: ${f}`),
  ];
  return (
    <span className="correctness fail" title={parts.join(' · ') || 'Failed the answer key'}>
      <span aria-hidden="true">✕</span> Failed — savings void
    </span>
  );
}

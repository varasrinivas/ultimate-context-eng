import type { CriterionResult } from '../../types';
import '../ui/primitives.css';

/** Per-criterion contribution bars on a shared 0-100 scale (weights sum to 100). */
export function ScoreBar({ criteria, score }: { criteria: CriterionResult[]; score: number }) {
  return (
    <div className="score-bar" aria-label={`Score ${score} of 100`}>
      {criteria.map((c) => (
        <div className="row" key={c.id}>
          <div>
            <div className="small" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span>{c.name}</span>
              <span className="mono muted">{c.met ? `+${c.weight}` : `0/${c.weight}`}</span>
            </div>
            <div className="track">
              <div
                className="fill"
                style={{
                  width: `${c.weight}%`,
                  background: c.met ? 'var(--accent)' : 'var(--line)',
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="small mono" style={{ textAlign: 'right' }}>
        total <strong>{score}</strong> / 100
      </div>
    </div>
  );
}

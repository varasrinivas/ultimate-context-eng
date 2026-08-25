import { useSession } from '../../context/SessionContext';
import { formatCost, formatTokens } from '../../lib/format';
import './lens.css';

/** Running session meter + per-call input-token sparkline. Compaction/isolation
 *  modes visibly flatten the line — that IS the lesson. */
export function SessionStrip() {
  const { calls, totalInputTokens, totalCostUsd } = useSession();
  if (calls.length === 0) return null;

  const w = 120, h = 26, pad = 2;
  const values = calls.map((c) => c.receipt.inputTokens);
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;
  const points = values
    .map((v, i) => `${pad + i * step},${h - pad - (v / max) * (h - pad * 2)}`)
    .join(' ');

  return (
    <div className="session-strip" aria-label={`Session: ${calls.length} calls, ${formatTokens(totalInputTokens)} input tokens`}>
      <span>
        session · {calls.length} calls · <strong>{formatTokens(totalInputTokens)}</strong> in-tok · {formatCost(totalCostUsd)}
      </span>
      <svg width={w} height={h} role="img" aria-label="Input tokens per call">
        <polyline
          points={points}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {values.length === 1 && (
          <circle cx={pad} cy={h - pad - (values[0] / max) * (h - pad * 2)} r="3" fill="var(--accent)" />
        )}
      </svg>
    </div>
  );
}

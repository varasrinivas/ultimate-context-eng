import type { Receipt } from '../../types';
import { LAYER_ORDER } from '../../types';
import { formatCost, formatLatency, formatTokens } from '../../lib/format';
import { LayerBar, LAYER_COLORS, LAYER_LABELS } from './LayerBar';
import { CorrectnessBadge } from './CorrectnessBadge';
import './lens.css';

function Line({ swatch, label, amount }: { swatch?: string; label: string; amount: string }) {
  return (
    <div className="receipt-line">
      <span className="label">
        {swatch && <span className="layer-swatch" style={{ background: swatch }} aria-hidden="true" />}
        {label}
      </span>
      <span className="leader" aria-hidden="true" />
      <span className="amount">{amount}</span>
    </div>
  );
}

/** The Token Lens: every AI call renders as an itemized receipt. */
export function TokenLens({ receipt }: { receipt: Receipt }) {
  const stampCls =
    !receipt.correctness.graded ? 'stamp-ungraded'
    : receipt.correctness.verdict === 'PASS' ? 'stamp-pass' : 'stamp-fail';
  const stampText =
    !receipt.correctness.graded ? 'ungraded'
    : receipt.correctness.verdict === 'PASS' ? 'verified' : 'failed';
  const cachePct = receipt.inputTokens > 0
    ? Math.round((receipt.cacheReadTokens / receipt.inputTokens) * 100) : 0;

  return (
    <div className="receipt" data-testid="token-lens" aria-label="Token receipt for this call">
      <div className="receipt-head">
        <span className="mode">{receipt.mode}</span>
        <span className="muted">token receipt</span>
      </div>

      <LayerBar layers={receipt.layers} />

      {LAYER_ORDER.map((k) => (
        <Line key={k} swatch={LAYER_COLORS[k]} label={LAYER_LABELS[k]} amount={formatTokens(receipt.layers[k])} />
      ))}
      <div className="receipt-line total">
        <span className="label">Input total</span>
        <span className="leader" aria-hidden="true" />
        <span className="amount">{formatTokens(receipt.inputTokens)}</span>
      </div>
      <Line label="Output" amount={formatTokens(receipt.outputTokens)} />
      <Line label="Cost" amount={formatCost(receipt.costUsd)} />

      <div className="receipt-meta">
        <span className="meta-chip" title="Tokens served from prompt cache">cache read {cachePct}%</span>
        {receipt.cacheCreationTokens > 0 && (
          <span className="meta-chip" title="Tokens written to prompt cache this call">
            cache write {formatTokens(receipt.cacheCreationTokens)}
          </span>
        )}
        <span className="meta-chip">{formatLatency(receipt.latencyMs)}</span>
        <CorrectnessBadge correctness={receipt.correctness} />
      </div>

      <span className={`stamp ${stampCls}`} aria-hidden="true">{stampText}</span>
    </div>
  );
}

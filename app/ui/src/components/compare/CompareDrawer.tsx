import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { compareReceipts } from '../../lib/deltas';
import { formatCost, formatTokens } from '../../lib/format';
import { LAYER_ORDER, MODES, type AskResponse, type Mode } from '../../types';
import { LAYER_COLORS } from '../lens/LayerBar';
import { TokenLens } from '../lens/TokenLens';
import { Spinner } from '../ui/Spinner';
import './compare.css';

function SharedScaleBar({ res, max }: { res: AskResponse; max: number }) {
  const total = res.receipt.inputTokens;
  return (
    <div className="shared-bar">
      <div className="bar-track">
        <div className="bar-row" style={{ width: `${(total / max) * 100}%` }}>
          {LAYER_ORDER.filter((k) => res.receipt.layers[k] > 0).map((k) => (
            <div
              key={k}
              style={{ flex: res.receipt.layers[k], background: LAYER_COLORS[k] }}
              title={`${k}: ${formatTokens(res.receipt.layers[k])}`}
            />
          ))}
        </div>
      </div>
      <span className="small mono muted">{formatTokens(total)} input tokens</span>
    </div>
  );
}

function Column({ question, mode, onMode, result, exclude }: {
  question: string;
  mode: Mode;
  onMode: (m: Mode) => void;
  result: AskResponse | null;
  exclude: Mode;
}) {
  void question;
  return (
    <div className="compare-col">
      <select value={mode} onChange={(e) => onMode(e.target.value as Mode)} aria-label="Strategy for this column">
        {MODES.filter((m) => m !== exclude).map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      {result ? <TokenLens receipt={result.receipt} /> : <Spinner label={`Running ${mode}`} />}
    </div>
  );
}

export function CompareDrawer({ question, initialMode, onClose }: {
  question: string;
  initialMode: Mode;
  onClose: () => void;
}) {
  const [modeA, setModeA] = useState<Mode>(initialMode === 'naive' ? 'naive' : 'naive');
  const [modeB, setModeB] = useState<Mode>(initialMode === 'naive' ? 'graph' : initialMode);
  const [resA, setResA] = useState<AskResponse | null>(null);
  const [resB, setResB] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setResA(null); setError(null);
    api.ask(question, modeA).then(
      (r) => { if (alive) setResA(r); },
      (e: unknown) => { if (alive) setError(e instanceof Error ? e.message : String(e)); },
    );
    return () => { alive = false; };
  }, [question, modeA]);

  useEffect(() => {
    let alive = true;
    setResB(null); setError(null);
    api.ask(question, modeB).then(
      (r) => { if (alive) setResB(r); },
      (e: unknown) => { if (alive) setError(e instanceof Error ? e.message : String(e)); },
    );
    return () => { alive = false; };
  }, [question, modeB]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const both = resA && resB;
  const delta = both ? compareReceipts(resA.receipt, resB.receipt) : null;
  const max = both ? Math.max(resA.receipt.inputTokens, resB.receipt.inputTokens, 1) : 1;
  const bFailed = both && resB.receipt.correctness.graded && resB.receipt.correctness.verdict === 'FAIL';

  return (
    <div className="compare-overlay" role="dialog" aria-modal="true" aria-label="Compare strategies" onClick={onClose}>
      <div className="compare-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="compare-head">
          <h2>Compare strategies</h2>
          <button type="button" className="close-btn" onClick={onClose}>Close (Esc)</button>
        </div>
        <p className="compare-q">"{question}"</p>

        {both && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
            <SharedScaleBar res={resA} max={max} />
            <SharedScaleBar res={resB} max={max} />
          </div>
        )}

        <div className="compare-grid">
          <Column question={question} mode={modeA} onMode={setModeA} result={resA} exclude={modeB} />
          <Column question={question} mode={modeB} onMode={setModeB} result={resB} exclude={modeA} />
        </div>

        {error && <div className="delta-callout" role="alert">Comparison failed: {error}</div>}
        {delta && (
          <div className="delta-callout" data-testid="delta-callout">
            <strong>{delta.headline}</strong>
            {' · '}cost Δ {formatCost(Math.abs(delta.costDeltaUsd))} {delta.costDeltaUsd >= 0 ? 'saved' : 'added'}
            {bFailed && (
              <div className="delta-warn">
                ✕ {modeB} FAILED the answer key on this question — token savings are void.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

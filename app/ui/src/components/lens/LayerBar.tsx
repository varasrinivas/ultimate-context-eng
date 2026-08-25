import type { Layers } from '../../types';
import { LAYER_ORDER } from '../../types';
import { formatTokens } from '../../lib/format';
import './lens.css';

export const LAYER_COLORS: Record<string, string> = {
  system: 'var(--layer-system)',
  retrieved: 'var(--layer-retrieved)',
  tool: 'var(--layer-tool)',
  history: 'var(--layer-history)',
  user: 'var(--layer-user)',
};

export const LAYER_LABELS: Record<string, string> = {
  system: 'System',
  retrieved: 'Retrieved',
  tool: 'Tool results',
  history: 'History',
  user: 'User turn',
};

/** Five-layer stacked bar with 2px surface gaps; identity is never color-alone —
 *  the itemized lines below the bar carry a swatch + label + exact count. */
export function LayerBar({ layers }: { layers: Layers }) {
  const total = LAYER_ORDER.reduce((s, k) => s + layers[k], 0) || 1;
  return (
    <div className="layer-bar" role="img" aria-label={`Input token layers: ${LAYER_ORDER.map((k) => `${LAYER_LABELS[k]} ${formatTokens(layers[k])}`).join(', ')}`}>
      {LAYER_ORDER.filter((k) => layers[k] > 0).map((k) => (
        <div
          key={k}
          className="seg"
          tabIndex={0}
          style={{ width: `${(layers[k] / total) * 100}%`, background: LAYER_COLORS[k] }}
          title={`${LAYER_LABELS[k]}: ${formatTokens(layers[k])} tokens (${Math.round((layers[k] / total) * 100)}%)`}
        />
      ))}
    </div>
  );
}

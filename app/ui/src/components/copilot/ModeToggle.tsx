import { MODES, MODE_HINTS, type Mode } from '../../types';
import './copilot.css';

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="mode-bar" role="radiogroup" aria-label="Context strategy">
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          className={`mode-btn ${mode === m ? 'active' : ''}`}
          title={MODE_HINTS[m]}
          onClick={() => onChange(m)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

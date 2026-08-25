import { useState } from 'react';
import { STANDING_QUESTIONS } from '../../data/standingQuestions';
import './copilot.css';

export function AskBox({ onAsk, onCompare, busy }: {
  onAsk: (question: string) => void;
  onCompare: (question: string) => void;
  busy: boolean;
}) {
  const [preset, setPreset] = useState('');
  const [freeText, setFreeText] = useState('');
  const question = preset || freeText;

  return (
    <div className="ask-box">
      <label className="eyebrow" htmlFor="preset">Standing questions</label>
      <select
        id="preset"
        value={preset}
        onChange={(e) => setPreset(e.target.value)}
        aria-label="Pick a standing question"
      >
        <option value="">— pick a graded question —</option>
        {STANDING_QUESTIONS.map((q) => (
          <option key={q.id} value={q.text}>
            {q.id} · {q.cls} — {q.text.slice(0, 60)}{q.text.length > 60 ? '…' : ''}
          </option>
        ))}
      </select>
      <textarea
        placeholder="…or ask anything about the queue, a request, or a member"
        value={freeText}
        onChange={(e) => { setFreeText(e.target.value); if (e.target.value) setPreset(''); }}
        aria-label="Free-form question"
      />
      <div className="ask-actions">
        <button type="button" className="ask-submit" disabled={!question || busy} onClick={() => onAsk(question)}>
          {busy ? 'Asking…' : 'Ask'}
        </button>
        <button
          type="button"
          className="ask-compare"
          disabled={!question || busy}
          onClick={() => onCompare(question)}
          title="Fire the same question under two strategies and compare receipts"
        >
          Compare strategies
        </button>
      </div>
    </div>
  );
}

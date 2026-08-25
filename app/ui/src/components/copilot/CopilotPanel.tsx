import { useState } from 'react';
import { api } from '../../api/client';
import { useSession } from '../../context/SessionContext';
import type { Mode } from '../../types';
import { TokenLens } from '../lens/TokenLens';
import { SessionStrip } from '../lens/SessionStrip';
import { CompareDrawer } from '../compare/CompareDrawer';
import { AskBox } from './AskBox';
import { ModeToggle } from './ModeToggle';
import './copilot.css';

export function CopilotPanel() {
  const { calls, addCall, replaySeen } = useSession();
  const [mode, setMode] = useState<Mode>('naive');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compareQuestion, setCompareQuestion] = useState<string | null>(null);
  const last = calls.length > 0 ? calls[calls.length - 1] : null;

  async function ask(question: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await api.ask(question, mode);
      addCall(question, res.answer, res.receipt);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="copilot" style={{ width: 'var(--copilot-w)' }} aria-label="Copilot panel">
      <div className="copilot-head">
        <h2>Copilot</h2>
        <span className="eyebrow">every call gets a receipt</span>
      </div>
      {replaySeen && (
        <div className="replay-banner" role="note">
          replay mode — recorded answers &amp; usage; set ANTHROPIC_API_KEY for live calls
        </div>
      )}
      <div className="copilot-body">
        <ModeToggle mode={mode} onChange={setMode} />
        <AskBox onAsk={ask} onCompare={(q) => setCompareQuestion(q)} busy={busy} />
        {error && <div className="answer-card" role="alert">Ask failed: {error}. The backend may be down — try VITE_MOCK=1.</div>}
        {last && (
          <>
            <div className="answer-card">
              <div className="answer-q muted">{last.question}</div>
              {last.answer}
            </div>
            <TokenLens receipt={last.receipt} />
          </>
        )}
        {!last && !error && (
          <p className="small muted">
            Pick a strategy, ask a question, and watch the Token Lens itemize what the call
            actually consumed — layer by layer, with a correctness stamp.
          </p>
        )}
      </div>
      <SessionStrip />
      {compareQuestion && (
        <CompareDrawer question={compareQuestion} initialMode={mode} onClose={() => setCompareQuestion(null)} />
      )}
    </aside>
  );
}

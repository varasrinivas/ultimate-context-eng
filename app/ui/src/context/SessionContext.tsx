import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { CopilotCall, Receipt } from '../types';

interface SessionState {
  calls: CopilotCall[];
  addCall: (question: string, answer: string, receipt: Receipt) => void;
  totalInputTokens: number;
  totalCostUsd: number;
  replaySeen: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [calls, setCalls] = useState<CopilotCall[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'light',
  );

  const addCall = useCallback((question: string, answer: string, receipt: Receipt) => {
    setCalls((prev) => [...prev, { id: prev.length + 1, question, answer, receipt }]);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('medflow-theme', next); } catch { /* private mode */ }
      return next;
    });
  }, []);

  const value = useMemo<SessionState>(() => ({
    calls,
    addCall,
    totalInputTokens: calls.reduce((s, c) => s + c.receipt.inputTokens, 0),
    totalCostUsd: calls.reduce((s, c) => s + c.receipt.costUsd, 0),
    replaySeen: calls.some((c) => c.receipt.source && c.receipt.source !== 'live'),
    theme,
    toggleTheme,
  }), [calls, addCall, theme, toggleTheme]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}

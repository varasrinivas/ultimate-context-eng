// Standalone demo API (VITE_MOCK=1): fixture-shaped receipts, deterministic per
// (question, mode) so the Compare drawer and tests are stable. Mirrors the
// teaching shape of the real bench results: naive is big, graph/routed are small
// on structural questions, abstention questions FAIL without the gate, etc.
import { STANDING_QUESTIONS } from '../data/standingQuestions';
import type { AskResponse, Correctness, Layers, Mode, Receipt } from '../types';
import { LAYER_ORDER } from '../types';
import { MEMBERS, POLICY, QUEUE, REQUESTS } from './mockData';

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** deterministic jitter in [0.92, 1.08) */
function jitter(seed: string): number {
  return 0.92 + (hash(seed) % 1600) / 10000;
}

const MODE_INPUT_BASE: Record<Mode, number> = {
  naive: 9400, budgeted: 5200, compressed: 3600, cached: 9100, jit: 2600,
  graph: 1180, okf: 1450, notes: 3100, isolated: 2200, routed: 1300,
};

const MODE_LAYER_MIX: Record<Mode, Layers> = {
  naive:      { system: 0.06, retrieved: 0.52, tool: 0.18, history: 0.21, user: 0.03 },
  budgeted:   { system: 0.10, retrieved: 0.40, tool: 0.20, history: 0.25, user: 0.05 },
  compressed: { system: 0.12, retrieved: 0.34, tool: 0.22, history: 0.26, user: 0.06 },
  cached:     { system: 0.06, retrieved: 0.52, tool: 0.18, history: 0.21, user: 0.03 },
  jit:        { system: 0.16, retrieved: 0.20, tool: 0.44, history: 0.12, user: 0.08 },
  graph:      { system: 0.18, retrieved: 0.08, tool: 0.55, history: 0.10, user: 0.09 },
  okf:        { system: 0.17, retrieved: 0.58, tool: 0.05, history: 0.12, user: 0.08 },
  notes:      { system: 0.13, retrieved: 0.30, tool: 0.15, history: 0.35, user: 0.07 },
  isolated:   { system: 0.22, retrieved: 0.10, tool: 0.48, history: 0.08, user: 0.12 },
  routed:     { system: 0.17, retrieved: 0.22, tool: 0.40, history: 0.12, user: 0.09 },
};

/** Teaching failures: which (question class, mode) cells fail correctness. */
function grade(questionId: string | null, mode: Mode): Correctness {
  if (!questionId) return { graded: false, verdict: 'UNGRADED', missingFacts: [], forbiddenHits: [] };
  const q = STANDING_QUESTIONS.find((s) => s.id === questionId)!;
  const fail = (missing: string[], forbidden: string[] = []): Correctness => ({
    graded: true, verdict: 'FAIL', missingFacts: missing, forbiddenHits: forbidden,
  });
  const pass: Correctness = { graded: true, verdict: 'PASS', missingFacts: [], forbiddenHits: [] };

  if (q.cls === 'abstention' && (mode === 'naive' || mode === 'cached')) {
    return fail([], [q.id === 'Q7' ? '1968-04-11 (fabricated DOB)' : 'invented note content']);
  }
  if (q.cls === 'logic' && mode === 'graph') {
    return fail(['threshold 80 (needs policy context, not just edges)']);
  }
  if (q.cls === 'aggregation' && mode === 'compressed' && q.id === 'Q9') {
    return fail(['PA-1004 (abstracted away by over-compression)']);
  }
  return pass;
}

function makeReceipt(question: string, mode: Mode): Receipt {
  const sq = STANDING_QUESTIONS.find((s) => question.includes(s.text.slice(0, 40)));
  const j = jitter(question + mode);
  const inputTokens = Math.round(MODE_INPUT_BASE[mode] * j);
  const mix = MODE_LAYER_MIX[mode];
  const layers = Object.fromEntries(
    LAYER_ORDER.map((k) => [k, Math.round(inputTokens * mix[k])]),
  ) as Layers;
  // make the layer sum exactly equal inputTokens (reconciliation invariant)
  const drift = inputTokens - LAYER_ORDER.reduce((s, k) => s + layers[k], 0);
  layers.retrieved += drift;

  const cacheReadTokens = mode === 'cached' ? Math.round(inputTokens * 0.8) : 0;
  const outputTokens = Math.round(220 * jitter(mode + question));
  const costUsd =
    ((inputTokens - cacheReadTokens) * 3 + cacheReadTokens * 0.3 + outputTokens * 15) / 1_000_000;

  return {
    mode,
    inputTokens,
    outputTokens,
    cacheReadTokens,
    cacheCreationTokens: mode === 'cached' && hash(question) % 3 === 0 ? Math.round(inputTokens * 0.8) : 0,
    costUsd,
    latencyMs: Math.round(900 * j + inputTokens / 40),
    layers,
    correctness: grade(sq?.id ?? null, mode),
    source: 'synthetic',
  };
}

function answerFor(question: string, mode: Mode): string {
  const sq = STANDING_QUESTIONS.find((s) => question.includes(s.text.slice(0, 40)));
  if (!sq) {
    return '[replay mode] Free-form questions are answered live when ANTHROPIC_API_KEY is set. Pick a standing question to see a graded, recorded answer.';
  }
  const c = grade(sq.id, mode);
  if (sq.cls === 'abstention') {
    return c.verdict === 'PASS'
      ? 'Insufficient evidence: that field is redacted (PHI-minimized), so I will not state it.'
      : 'The requested value is 1968-04-11.'; // deliberately fabricated — the teaching failure
  }
  return `[${mode}] Grounded answer to ${sq.id} assembled from ${
    mode === 'graph' ? 'the domain graph (EXTRACTED edges)' : mode === 'okf' ? 'canonical concept files' : 'the assembled context'
  }. ${c.verdict === 'FAIL' ? '(This cell is a known teaching failure — see the correctness badge.)' : ''}`;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  async getQueue() { await delay(120); return QUEUE; },
  async getRequest(id: string) {
    await delay(100);
    const r = REQUESTS.find((x) => x.id === id);
    if (!r) throw new Error(`Unknown request ${id}`);
    return r;
  },
  async getRequests() { await delay(100); return REQUESTS; },
  async getMember(id: string) {
    await delay(100);
    const m = MEMBERS.find((x) => x.id === id);
    if (!m) throw new Error(`Unknown member ${id}`);
    return m;
  },
  async getMembers() { await delay(100); return MEMBERS; },
  async getPolicy() { await delay(60); return POLICY; },
  async ask(question: string, mode: Mode): Promise<AskResponse> {
    await delay(350);
    return { answer: answerFor(question, mode), receipt: makeReceipt(question, mode) };
  },
};

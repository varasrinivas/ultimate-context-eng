export type Mode =
  | 'naive' | 'budgeted' | 'compressed' | 'cached' | 'jit'
  | 'graph' | 'okf' | 'notes' | 'isolated' | 'routed';

export const MODES: Mode[] = [
  'naive', 'budgeted', 'compressed', 'cached', 'jit',
  'graph', 'okf', 'notes', 'isolated', 'routed',
];

export const MODE_HINTS: Record<Mode, string> = {
  naive: 'Dump everything into context — the control',
  budgeted: 'Per-layer token caps with priority eviction',
  compressed: 'Prune → extract-verbatim → abstract, fidelity-asserted',
  cached: 'Static-first ordering + prompt caching',
  jit: 'Just-in-time identifiers, load on demand',
  graph: 'Deterministic selection from the provenance-tagged domain graph',
  okf: 'Canonical rule concepts read directly',
  notes: 'Structured note store written across the session',
  isolated: 'Clean-window sub-agent returns a condensed summary',
  routed: 'Question class routed to its cheapest correct strategy',
};

export type LayerKey = 'system' | 'retrieved' | 'tool' | 'history' | 'user';
export const LAYER_ORDER: LayerKey[] = ['system', 'retrieved', 'tool', 'history', 'user'];

export type Layers = Record<LayerKey, number>;

export type Verdict = 'PASS' | 'FAIL' | 'UNGRADED';

export interface Correctness {
  graded: boolean;
  verdict: Verdict;
  missingFacts: string[];
  forbiddenHits: string[];
}

export interface Receipt {
  mode: Mode;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
  costUsd: number;
  latencyMs: number;
  layers: Layers;
  correctness: Correctness;
  source?: 'live' | 'replay' | 'synthetic';
}

export interface AskResponse {
  answer: string;
  receipt: Receipt;
}

export type Decision = 'APPROVED' | 'MANUAL_REVIEW' | 'DENIED';

export interface CriterionResult {
  id: string;
  name: string;
  weight: number;
  met: boolean;
}

export interface AuthRequestSummary {
  id: string;
  memberId: string;
  memberName: string;
  procedureCode: string;
  procedureName: string;
  score: number;
  decision: Decision;
  missingCriteria: string[];
}

export interface AuthRequestDetail extends AuthRequestSummary {
  providerName: string;
  reason: string;
  criteria: CriterionResult[];
  notes: { author: string; text: string }[];
}

export interface Member {
  id: string;
  name: string;
  planTier: 'STANDARD' | 'PREMIUM';
  planStatus: 'ACTIVE' | 'LAPSED';
  dob: string; // "_redacted" for PHI-minimized members
  history: { id: string; procedureName: string; decision: Decision }[];
}

export interface Policy {
  autoApproveThreshold: number;
  manualReviewThreshold: number;
  eligibilityRule: string;
}

export interface CopilotCall {
  id: number;
  question: string;
  answer: string;
  receipt: Receipt;
}

// Client-side mirror of the scoring rule in bench/seed/dataset.json (_contract):
// eligibility first; then score = sum of MET criteria weights;
// score >= 80 -> APPROVED, >= 50 -> MANUAL_REVIEW, else DENIED.
import type { Decision } from '../types';

export interface ScoringInput {
  planStatus: 'ACTIVE' | 'LAPSED';
  planTier: 'STANDARD' | 'PREMIUM';
  procedureTier: 'diagnostics' | 'surgical';
  criteria: { id: string; name: string; weight: number; met: boolean }[];
}

export interface ScoringResult {
  eligible: boolean;
  eligibilityReason: string | null;
  score: number;
  decision: Decision;
  missing: string[];
}

export const AUTO_APPROVE_THRESHOLD = 80;
export const MANUAL_REVIEW_THRESHOLD = 50;

export function evaluate(input: ScoringInput): ScoringResult {
  if (input.planStatus !== 'ACTIVE') {
    return {
      eligible: false,
      eligibilityReason: `Plan status ${input.planStatus} is not ACTIVE`,
      score: 0,
      decision: 'DENIED',
      missing: [],
    };
  }
  if (input.procedureTier === 'surgical' && input.planTier !== 'PREMIUM') {
    return {
      eligible: false,
      eligibilityReason: `Plan tier ${input.planTier} does not cover surgical procedures`,
      score: 0,
      decision: 'DENIED',
      missing: [],
    };
  }
  const score = input.criteria.filter((c) => c.met).reduce((s, c) => s + c.weight, 0);
  const missing = input.criteria.filter((c) => !c.met).map((c) => c.name);
  const decision: Decision =
    score >= AUTO_APPROVE_THRESHOLD ? 'APPROVED'
    : score >= MANUAL_REVIEW_THRESHOLD ? 'MANUAL_REVIEW'
    : 'DENIED';
  return { eligible: true, eligibilityReason: null, score, decision, missing };
}

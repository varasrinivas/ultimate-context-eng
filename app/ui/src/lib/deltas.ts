import type { Receipt } from '../types';

export interface CompareDelta {
  /** fraction of input tokens B saved vs A; negative means B used MORE */
  inputSavedFraction: number;
  inputDeltaTokens: number;
  costDeltaUsd: number;
  headline: string;
}

export function compareReceipts(a: Receipt, b: Receipt): CompareDelta {
  const inputDeltaTokens = a.inputTokens - b.inputTokens;
  const inputSavedFraction = a.inputTokens > 0 ? inputDeltaTokens / a.inputTokens : 0;
  const costDeltaUsd = a.costUsd - b.costUsd;
  const pct = Math.abs(Math.round(inputSavedFraction * 100));
  const headline =
    inputDeltaTokens === 0
      ? `${b.mode} used the same input tokens as ${a.mode}`
      : inputDeltaTokens > 0
        ? `${b.mode} used ${pct}% fewer input tokens than ${a.mode}`
        : `${b.mode} used ${pct}% more input tokens than ${a.mode}`;
  return { inputSavedFraction, inputDeltaTokens, costDeltaUsd, headline };
}

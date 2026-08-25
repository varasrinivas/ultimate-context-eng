import { compareReceipts } from '../lib/deltas';
import type { Receipt } from '../types';

function receipt(mode: Receipt['mode'], inputTokens: number, costUsd: number): Receipt {
  return {
    mode, inputTokens, outputTokens: 200, cacheReadTokens: 0, cacheCreationTokens: 0,
    costUsd, latencyMs: 1000,
    layers: { system: inputTokens, retrieved: 0, tool: 0, history: 0, user: 0 },
    correctness: { graded: false, verdict: 'UNGRADED', missingFacts: [], forbiddenHits: [] },
  };
}

describe('compareReceipts', () => {
  it('computes the saved fraction and headline when B is cheaper', () => {
    const d = compareReceipts(receipt('naive', 10000, 0.05), receipt('graph', 2900, 0.02));
    expect(d.inputDeltaTokens).toBe(7100);
    expect(d.inputSavedFraction).toBeCloseTo(0.71, 2);
    expect(d.headline).toBe('graph used 71% fewer input tokens than naive');
    expect(d.costDeltaUsd).toBeCloseTo(0.03, 5);
  });

  it('flips the headline when B costs more', () => {
    const d = compareReceipts(receipt('naive', 4000, 0.02), receipt('isolated', 6000, 0.03));
    expect(d.headline).toBe('isolated used 50% more input tokens than naive');
  });
});

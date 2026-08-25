import { evaluate } from '../lib/scoring';

const criteria72148 = [
  { id: 'C-72148-1', name: 'Conservative therapy >= 6 weeks documented', weight: 40, met: true },
  { id: 'C-72148-2', name: 'Neurological deficit present', weight: 35, met: false },
  { id: 'C-72148-3', name: 'No MRI of same region in past 12 months', weight: 25, met: true },
];

describe('evaluate (mirror of the seed contract)', () => {
  it('reproduces PA-1002: score 65 -> MANUAL_REVIEW', () => {
    const r = evaluate({ planStatus: 'ACTIVE', planTier: 'STANDARD', procedureTier: 'diagnostics', criteria: criteria72148 });
    expect(r.score).toBe(65);
    expect(r.decision).toBe('MANUAL_REVIEW');
    expect(r.missing).toEqual(['Neurological deficit present']);
  });

  it('reproduces PA-1005: STANDARD tier denied surgical for eligibility', () => {
    const r = evaluate({
      planStatus: 'ACTIVE', planTier: 'STANDARD', procedureTier: 'surgical',
      criteria: criteria72148.map((c) => ({ ...c, met: true })),
    });
    expect(r.eligible).toBe(false);
    expect(r.decision).toBe('DENIED');
  });

  it('treats both thresholds as inclusive (PA-1008 and PA-1010 boundary cases)', () => {
    const at80 = evaluate({
      planStatus: 'ACTIVE', planTier: 'PREMIUM', procedureTier: 'diagnostics',
      criteria: [{ id: 'a', name: 'a', weight: 80, met: true }, { id: 'b', name: 'b', weight: 20, met: false }],
    });
    expect(at80.decision).toBe('APPROVED');
    const at50 = evaluate({
      planStatus: 'ACTIVE', planTier: 'PREMIUM', procedureTier: 'diagnostics',
      criteria: [{ id: 'a', name: 'a', weight: 50, met: true }, { id: 'b', name: 'b', weight: 50, met: false }],
    });
    expect(at50.decision).toBe('MANUAL_REVIEW');
  });
});

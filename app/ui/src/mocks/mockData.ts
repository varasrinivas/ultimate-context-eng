// Mirrors bench/seed/dataset.json so the UI is demoable with VITE_MOCK=1.
import type { AuthRequestDetail, AuthRequestSummary, Member, Policy } from '../types';

export const POLICY: Policy = {
  autoApproveThreshold: 80,
  manualReviewThreshold: 50,
  eligibilityRule:
    "Member plan status must be ACTIVE and the procedure must be covered by the member's plan tier (STANDARD covers diagnostics; PREMIUM covers diagnostics and surgical).",
};

const C = {
  '72148': [
    { id: 'C-72148-1', name: 'Conservative therapy >= 6 weeks documented', weight: 40 },
    { id: 'C-72148-2', name: 'Neurological deficit present', weight: 35 },
    { id: 'C-72148-3', name: 'No MRI of same region in past 12 months', weight: 25 },
  ],
  '29881': [
    { id: 'C-29881-1', name: 'MRI-confirmed meniscal tear', weight: 45 },
    { id: 'C-29881-2', name: 'Failed 12 weeks conservative management', weight: 35 },
    { id: 'C-29881-3', name: 'Mechanical symptoms (locking or catching)', weight: 20 },
  ],
  '95810': [
    { id: 'C-95810-1', name: 'Epworth Sleepiness Scale >= 10', weight: 50 },
    { id: 'C-95810-2', name: 'Witnessed apneas or BMI >= 35', weight: 30 },
    { id: 'C-95810-3', name: 'No prior positive home sleep test', weight: 20 },
  ],
} as const;

const PROC_NAMES: Record<string, string> = {
  '72148': 'MRI Lumbar Spine',
  '29881': 'Knee Arthroscopy with Meniscectomy',
  '95810': 'Polysomnography (Sleep Study)',
};

interface Row {
  id: string; member: string; memberName: string; provider: string;
  procedure: keyof typeof C; met: string[]; score: number;
  decision: AuthRequestDetail['decision']; reason: string;
}

const ROWS: Row[] = [
  { id: 'PA-1001', member: 'M-2001', memberName: 'Rosa Delgado', provider: 'Dr. Samuel Osei', procedure: '72148', met: ['C-72148-1', 'C-72148-2', 'C-72148-3'], score: 100, decision: 'APPROVED', reason: 'score 100 >= 80' },
  { id: 'PA-1002', member: 'M-2002', memberName: 'James Okafor', provider: 'Dr. Samuel Osei', procedure: '72148', met: ['C-72148-1', 'C-72148-3'], score: 65, decision: 'MANUAL_REVIEW', reason: 'score 65 in [50,80); missing C-72148-2 Neurological deficit present' },
  { id: 'PA-1003', member: 'M-2005', memberName: 'Hannah Kim', provider: 'Dr. Samuel Osei', procedure: '72148', met: ['C-72148-3'], score: 25, decision: 'DENIED', reason: 'score 25 < 50; missing C-72148-1, C-72148-2' },
  { id: 'PA-1004', member: 'M-2001', memberName: 'Rosa Delgado', provider: 'Dr. Elena Vasquez', procedure: '29881', met: ['C-29881-1', 'C-29881-3'], score: 65, decision: 'MANUAL_REVIEW', reason: 'score 65 in [50,80); missing C-29881-2 Failed 12 weeks conservative management' },
  { id: 'PA-1005', member: 'M-2002', memberName: 'James Okafor', provider: 'Dr. Elena Vasquez', procedure: '29881', met: ['C-29881-1', 'C-29881-2', 'C-29881-3'], score: 0, decision: 'DENIED', reason: 'ELIGIBILITY: plan tier STANDARD does not cover surgical procedures' },
  { id: 'PA-1006', member: 'M-2006', memberName: 'Marcus Bell', provider: 'Dr. Elena Vasquez', procedure: '29881', met: ['C-29881-1', 'C-29881-2', 'C-29881-3'], score: 100, decision: 'APPROVED', reason: 'score 100 >= 80' },
  { id: 'PA-1007', member: 'M-2003', memberName: 'Priya Raman', provider: 'Dr. Ingrid Larsen', procedure: '95810', met: ['C-95810-3'], score: 20, decision: 'DENIED', reason: 'score 20 < 50; missing C-95810-1 Epworth >= 10, C-95810-2 witnessed apneas/BMI' },
  { id: 'PA-1008', member: 'M-2003', memberName: 'Priya Raman', provider: 'Dr. Ingrid Larsen', procedure: '95810', met: ['C-95810-1', 'C-95810-2'], score: 80, decision: 'APPROVED', reason: 'score 80 >= 80 (boundary case: threshold is inclusive)' },
  { id: 'PA-1009', member: 'M-2004', memberName: 'Dale Whitfield', provider: 'Dr. Tomas Rivera', procedure: '72148', met: ['C-72148-1', 'C-72148-2', 'C-72148-3'], score: 0, decision: 'DENIED', reason: 'ELIGIBILITY: plan status LAPSED' },
  { id: 'PA-1010', member: 'M-2005', memberName: 'Hannah Kim', provider: 'Dr. Ingrid Larsen', procedure: '95810', met: ['C-95810-1'], score: 50, decision: 'MANUAL_REVIEW', reason: 'score 50 in [50,80) (boundary case: review threshold is inclusive)' },
];

const NOTES: Record<string, { author: string; text: string }[]> = {
  'PA-1002': [{ author: 'Dr. Samuel Osei', text: 'Patient reports worsening radicular pain; EMG scheduled to document deficit.' }],
  'PA-1004': [{ author: 'Dr. Elena Vasquez', text: 'PT course started 2026-07-01; will reach 12 weeks on 2026-09-23.' }],
  'PA-1006': [{ author: 'Dr. Elena Vasquez', text: 'Locking episodes twice weekly; surgical candidacy confirmed.' }],
};

function toDetail(r: Row): AuthRequestDetail {
  const criteria = C[r.procedure].map((c) => ({ ...c, met: r.met.includes(c.id) }));
  return {
    id: r.id,
    memberId: r.member,
    memberName: r.memberName,
    providerName: r.provider,
    procedureCode: r.procedure,
    procedureName: PROC_NAMES[r.procedure],
    score: r.score,
    decision: r.decision,
    reason: r.reason,
    criteria,
    missingCriteria: criteria.filter((c) => !c.met).map((c) => c.name),
    notes: NOTES[r.id] ?? [],
  };
}

export const REQUESTS: AuthRequestDetail[] = ROWS.map(toDetail);

export const QUEUE: AuthRequestSummary[] = REQUESTS.filter((r) => r.decision === 'MANUAL_REVIEW');

export const MEMBERS: Member[] = [
  { id: 'M-2001', name: 'Rosa Delgado', planTier: 'PREMIUM', planStatus: 'ACTIVE', dob: '1979-03-14', history: [] },
  { id: 'M-2002', name: 'James Okafor', planTier: 'STANDARD', planStatus: 'ACTIVE', dob: '1985-11-02', history: [] },
  { id: 'M-2003', name: 'Priya Raman', planTier: 'PREMIUM', planStatus: 'ACTIVE', dob: '_redacted', history: [] },
  { id: 'M-2004', name: 'Dale Whitfield', planTier: 'STANDARD', planStatus: 'LAPSED', dob: '1962-07-29', history: [] },
  { id: 'M-2005', name: 'Hannah Kim', planTier: 'STANDARD', planStatus: 'ACTIVE', dob: '1993-01-20', history: [] },
  { id: 'M-2006', name: 'Marcus Bell', planTier: 'PREMIUM', planStatus: 'ACTIVE', dob: '1971-09-05', history: [] },
].map((m) => ({
  ...m,
  planTier: m.planTier as Member['planTier'],
  planStatus: m.planStatus as Member['planStatus'],
  history: REQUESTS.filter((r) => r.memberId === m.id).map((r) => ({
    id: r.id,
    procedureName: r.procedureName,
    decision: r.decision,
  })),
}));

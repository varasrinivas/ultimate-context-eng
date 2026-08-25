import { render, screen } from '@testing-library/react';
import { TokenLens } from '../components/lens/TokenLens';
import type { Receipt } from '../types';

const receipt: Receipt = {
  mode: 'graph',
  inputTokens: 1180,
  outputTokens: 240,
  cacheReadTokens: 0,
  cacheCreationTokens: 0,
  costUsd: 0.0071,
  latencyMs: 940,
  layers: { system: 212, retrieved: 94, tool: 649, history: 118, user: 107 },
  correctness: { graded: true, verdict: 'PASS', missingFacts: [], forbiddenHits: [] },
  source: 'replay',
};

describe('TokenLens', () => {
  it('itemizes every layer with exact counts and the input total', () => {
    render(<TokenLens receipt={receipt} />);
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('649')).toBeInTheDocument(); // tool layer, direct label
    expect(screen.getByText('1,180')).toBeInTheDocument(); // input total
    expect(screen.getByText('graph')).toBeInTheDocument();
  });

  it('shows a PASS correctness badge and stamp for verified answers', () => {
    render(<TokenLens receipt={receipt} />);
    expect(screen.getByText('Correct')).toBeInTheDocument();
    expect(screen.getByText('verified')).toBeInTheDocument();
  });

  it('marks failed answers as savings-void', () => {
    const failed: Receipt = {
      ...receipt,
      correctness: { graded: true, verdict: 'FAIL', missingFacts: ['threshold 80'], forbiddenHits: [] },
    };
    render(<TokenLens receipt={failed} />);
    expect(screen.getByText(/Failed — savings void/)).toBeInTheDocument();
  });
});

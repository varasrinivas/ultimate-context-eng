import { mockApi } from '../mocks/mockApi';
import type {
  AskResponse, AuthRequestDetail, AuthRequestSummary, Member, Mode, Policy,
} from '../types';

const USE_MOCK = import.meta.env.VITE_MOCK === '1';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

let sessionId = '';
function getSessionId(): string {
  if (!sessionId) sessionId = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return sessionId;
}

export const api = {
  getQueue(): Promise<AuthRequestSummary[]> {
    return USE_MOCK ? mockApi.getQueue() : get('/api/queue');
  },
  getRequests(): Promise<AuthRequestDetail[]> {
    return USE_MOCK ? mockApi.getRequests() : get('/api/requests');
  },
  getRequest(id: string): Promise<AuthRequestDetail> {
    return USE_MOCK ? mockApi.getRequest(id) : get(`/api/requests/${id}`);
  },
  getMembers(): Promise<Member[]> {
    return USE_MOCK ? mockApi.getMembers() : get('/api/members');
  },
  getMember(id: string): Promise<Member> {
    return USE_MOCK ? mockApi.getMember(id) : get(`/api/members/${id}`);
  },
  getPolicy(): Promise<Policy> {
    return USE_MOCK ? mockApi.getPolicy() : get('/api/policy');
  },
  async ask(question: string, mode: Mode): Promise<AskResponse> {
    if (USE_MOCK) return mockApi.ask(question, mode);
    const res = await fetch('/api/copilot/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, mode, sessionId: getSessionId() }),
    });
    if (!res.ok) throw new Error(`Copilot ask failed: ${res.status} ${res.statusText}`);
    // live backend wraps in {primary, compare}; mock returns the flat shape
    const data = await res.json();
    return (data.primary ?? data) as AskResponse;
  },
};

# U09 Lab: Build It with AI — The Hand-Back Contract

## Objective
Build (with Claude writing the code) an isolated subtask with an enforced memo budget, simulate a 12-turn session comparing naive re-carry vs memo reuse — then return the transcript instead of the memo and watch the contract refuse the hand-back.

## Prerequisites
- Completed the U09 Understand It lab (you have the break-even arithmetic)
- Python 3.10+

## The Build (40 min)

### Step 1: The contract (12 min)
**Claude prompt to use:**
```
Write handback_contract.py. Resolve the dataset as Path(__file__).resolve().parents[2] / "bench" / "seed" / "dataset.json" (the script lives in labs/uXX-lab/) and load it. Implement:
- explore_member(member_id): simulates the sub-agent's messy exploration -
  builds a WORKING list containing every auth_request record as pretty JSON,
  plus fake dead-end strings, totaling well over 4000 chars. Returns
  (working, memo) where memo is a compact string: one verbatim line per
  request "<id>: <decision> (score <score>)" plus one eligibility note.
- handback(memo, budget_tokens=1500): asserts len(memo)//4 <= budget_tokens
  AND that the memo contains every request id for that member (fidelity),
  raising AssertionError naming the violation. Returns the memo.
- A main that explores M-2001, prints working size vs memo size in tokens,
  and the accepted memo.
Standard library only. Return only the code.
```
**Expected output (shape):**
```
sub-agent working set: ~1,240 tok   memo: ~38 tok   (32x stays behind)
MEMO re M-2001:
  PA-1001: APPROVED (score 100)
  PA-1004: MANUAL_REVIEW (score 65)
  No eligibility denials on file.
```

### Step 2: The 12-turn session (10 min)
**Claude prompt to use:**
```
Add simulate_session(turns=12): turn 1 is the deep exploration; turns 2-12
are follow-ups of ~150 tokens each. Strategy A (naive): every follow-up
re-carries the full working set. Strategy B (isolated): every follow-up
carries only the memo. Print per-turn cumulative token totals for both and
the turn number where B's cumulative total first beats A's.
```
**Expected output (shape):**
```
turn   naive-cumulative   isolated-cumulative
1             1,240                1,278
2             2,630                1,466
3             4,020                1,654   <- break-even passed
...
12           16,530                3,346
B wins from turn 2-3 onward; by turn 12 it carries ~5x less.
```
Compare with your Understand-lab arithmetic — same shape, now executable.

### Step 3: Break it on purpose (10 min)
**Claude prompt to use:**
```
Add a --transcript flag: when set, handback() receives the full working set
joined as the "memo". Do not weaken the contract.
```
Run `python handback_contract.py --transcript`.
**Expected:**
```
AssertionError: hand-back over budget (1,240 tok > 1,500 is fine, so use a
working set that exceeds it - e.g. include all members) OR the fidelity
message if ids are drowned in noise
```
If your working set slips under the budget, enlarge the exploration (all six members) until the contract genuinely fires — a contract you've never seen refuse is decoration (the course's recurring test).

### Step 4: Parallel memos (5 min)
Run three explorations (M-2001, M-2002, M-2003) and hand back three memos. Print what the parent window carries (3 memos + question) vs what naive parallel exploration would have (3 working sets). This is Anthropic's multi-agent pattern in ~15 lines: clean windows below, condensed summaries above.

## Deliverable
`u09-lab/handback_contract.py` — enforced memo budget, fidelity check, break-even simulation, parallel fan-in.

## Stretch Goals
- Add a second-level delegation (a sub-sub-agent) and make the fidelity contract compose — does a memo-of-memos still carry every request id? Tighten until it does.
- Price both strategies with U06's pricing table, including cache reads on the reused memo — isolation plus caching stack.

## Connection to Next Module
Track 3 gave you compress and isolate with seatbelts. Track 4 asks the harder question: not "how many tokens" but "can you trust the answer at all" — grounding, provenance, and the abstention gate that would rather say 'insufficient evidence' than invent a date of birth.

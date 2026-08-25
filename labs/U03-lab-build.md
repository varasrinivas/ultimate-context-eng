# U03 Lab: Build It with AI — The Note Fidelity Auditor

## Objective
Build a scripted-session evaluator that proves the note store keeps every load-bearing identifier while total session input stays under budget — write's version of the fidelity assertion.

## Prerequisites
- Completed the U03 Understand It lab
- Python 3.10+

## The Build (35 min)

### Step 1: Script the session (12 min)
**Claude prompt to use:**
```
Write notes_audit.py using only the standard library. It runs a scripted
5-ask session against http://localhost:8080/api/copilot/ask, all with
{"mode": "notes", "sessionId": "notes-audit"}:
  Q2, Q6, Q9, then "Which criteria is PA-1002 missing?",
  then Q9 AGAIN (the re-ask is the point).
Response shape {"primary": {"answer",...,"receipt"}}. Collect per-ask:
inputTokens, layers.history, layers.retrieved, correctness.verdict.
Print a session table (ask#, question id/stub, input, history, retrieved,
verdict) and TOTAL input for the session. Return only the code.
```
Run it. **Expected shape:** history stays ~0 on every row; the second Q9 is no more expensive than the first; total session input well under 1,500 tokens (one naive Q9 alone costs ~1,700).

### Step 2: The fidelity assertion (12 min)
**Claude prompt to use:**
```
Extend notes_audit.py: after the session, assert note fidelity. REQUIRED_IDS =
["PA-1001","PA-1004","PA-1002","MANUAL_REVIEW","APPROVED"]. Take the FINAL
Q9 answer text and assert every REQUIRED_ID appears (case-insensitive except
the PA- ids, which must appear verbatim). On any miss, raise AssertionError
naming the lost identifiers. Print "FIDELITY OK: N/N identifiers survived
the write-read cycle" on success.
```
**Expected output:** `FIDELITY OK: 5/5 identifiers survived the write-read cycle`. This is the M18-style rule promoted to memory: whatever the note store does internally, load-bearing identifiers must survive the round trip.

### Step 3: Break it on purpose (8 min)
Re-run with `REQUIRED_IDS` including `"PA-1006"` — an identifier this session never touched. **Expected:** the assertion FAILS naming PA-1006. Understand why this failure is correct: notes store what the session knew; asserting facts it never saw distinguishes *memory fidelity* (must hold) from *omniscience* (must not be assumed). Revert.

### Step 4: The budget line (3 min)
Add a final assertion: total session input ≤ 1,500 tokens. Fidelity AND budget together are the write contract — either alone is easy.

## Deliverable
`u03-lab/notes_audit.py` — a session evaluator asserting identifier fidelity and a session token budget simultaneously.

## Stretch Goals
- Run the identical script with `"mode": "naive"` and print the two session totals side by side — your first self-measured write-family delta.
- Add a staleness probe: ask Q2 a sixth time and check the notes still say three requests are in review (they should — nothing changed; U11 is where change arrives).

## Connection to Next Module
Write handles what the session learns. U04 turns to select — what to pull in from everything the session *hasn't* learned — and the wide-then-narrow discipline that keeps the desk from drowning.

# U08 Lab: Understand It — Two Sparklines, One Lesson

## Objective
Run the same six-question review session in `naive` and `notes` modes and watch the session strip draw two different futures: one curve that climbs until the goal drowns, and one that stays flat near 200 tokens per call.

## Prerequisites
- Completed U08 module content; app running in replay mode (U00 lab setup)

## Exercise (25 min)

### Step 1: The append-only session
In **naive** mode, ask these six in order, same session: Q1, Q3, Q5, Q6, Q9, Q10.
**What to observe:** the session strip's sparkline and the *history* layer on each receipt — every call re-carries the growing transcript.
**Expected output (shape):**
```
call 1  history ~0        input ~1,694
call 3  history climbing  input climbing
call 6  history is now a significant slice of every receipt
session total: ~10,200 tokens and rising monotonically
```

### Step 2: The notes session
Reset (new session id), switch to **notes**, ask the same six.
**Expected output (replay fixtures, synthetic-pre-recording):**
```
Q1 141 · Q3 231 · Q5 272 · Q6 228 · Q9 167 · Q10 262
session total: ~1,301 tokens — flat sparkline, history layer near zero
```
**What to observe:** after each answer the mode wrote structured notes *outside* the window; each next call loaded relevant notes instead of the transcript. The established facts traveled; the conversation that established them did not.

### Step 3: Read a note doing its job
Q9 asks for M-2001's history — which the session has already touched. In notes mode the receipt's retrieved layer carries something like `M-2001: PA-1001 APPROVED, PA-1004 MANUAL_REVIEW` — a ~15-token fact standing in for however many turns established it. Find it, and check the ✓ stamp: the fact survived the trip through external memory.

### Step 4: Name the curve
Sketch (or screenshot) both sparklines. Label the naive one with where the kit's M24 lab saw an agent re-do a completed step — pressure, not capacity. Label the notes one with the write/select loop: write after answering, select before asking.

## Reflection Questions
1. The naive session's *answers* were all correct too. What, precisely, is degrading as that sparkline climbs — and when would you expect the first visible casualty?
2. Notes mode beat even compressed on this session shape. What property of a *session* (vs a single question) is doing the extra work?
3. How does this connect to the detective's case board — and what, in this lab, played the role of the notebook filed at the precinct?

## Key Insight
Sessions are saved by changing what the window carries between calls — external memory turns a climbing curve into a flat one without losing a single graded fact.

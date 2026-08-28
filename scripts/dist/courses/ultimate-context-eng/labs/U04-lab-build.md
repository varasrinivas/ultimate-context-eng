# U04 Lab: Build It with AI — The Select Shootout

## Objective
Build the shootout that settles select-posture arguments with graded numbers: budgeted vs jit vs okf across the structural and canonical classes, with a whole-record integrity check.

## Prerequisites
- Completed the U04 Understand It lab
- Python 3.10+

## The Build (35 min)

### Step 1: Scaffold the shootout (12 min)
**Claude prompt to use:**
```
Write select_shootout.py using only the standard library. Load
bench/seed/dataset.json and take standing questions with class "structural"
or "canonical" (Q1,Q2,Q3,Q4). For each, POST to
http://localhost:8080/api/copilot/ask in modes ["budgeted","jit","okf"]
(sessionId "shootout"). Response shape {"primary":{"answer","receipt"}}.
Print a table: qid, class, mode, inputTokens, latencyMs, verdict (from
receipt.correctness). Then per class, print the winner = cheapest mode whose
verdict is PASS, formatted "structural: jit (143-286 tok)". Fail loudly on
non-200. Return only the code.
```
Run it. **Expected:** twelve rows, all PASS; winners — structural: jit; canonical: okf (186 on Q3/Q4 vs jit's 285/145... note Q4: jit 145 nearly ties okf 186 — a good reminder that classes are tendencies, not laws; the *class* winner is decided on the full class, not one question).

### Step 2: The whole-record integrity check (12 min)
**Claude prompt to use:**
```
Extend select_shootout.py with check_integrity(answer): scan every answer for
the seeded identifier patterns PA-10XX, C-XXXXX-N, M-20XX and 5-digit
procedure codes using regexes; assert every matched identifier is COMPLETE
(e.g. no "PA-10" or "C-72148-" truncations — implement by asserting each
regex match is not immediately preceded/followed by a word character that
would extend it into a malformed id). Print "INTEGRITY OK (N identifiers
checked)" or raise naming the malformed fragment.
```
**Expected output:** `INTEGRITY OK` on all rows — budgeted's whole-record eviction rule means no answer should ever contain a truncated identifier. This is what mid-record truncation would break, and why the rule exists.

### Step 3: Break it on purpose (8 min)
Feed `check_integrity` the planted string `"criteria C-72148- and C-72148-2 apply"` directly. **Expected:** AssertionError naming `C-72148-`. An integrity check that has never caught a fragment is decoration — same lesson, third lab in a row, because it is the course's most transferable habit.

### Step 4: The recommendation line (3 min)
End the script with one printed sentence per class: `canonical: use okf — settled facts get lookup (fuzzy would get retrieval)`. Your shootout now states the boundary, not just the numbers.

## Deliverable
`u04-lab/select_shootout.py` — graded select-posture comparison with per-class winners and an identifier-integrity check.

## Stretch Goals
- Add `--include-naive` and watch the control anchor every class (and fail nothing here — naive's failure lives on Q7, an abstention question, coming in U10).
- Add median-of-3 support with `--reps 3` for future live runs (replay reps are identical; live ones won't be — U02's rule).

## Connection to Next Module
You've selected by cap and by demand. U05 selects by *structure*: just-in-time identifiers backed by a provenance-tagged graph and canonical concept files — select's precision instruments.

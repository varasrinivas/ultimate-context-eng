# U06 Lab: Build It with AI — The Cacheability Lint

## Objective
Build (with Claude writing the code) the volatile-token linter for static prefixes, plus a session-cost comparator that quantifies exactly what a dirty prefix costs over a 10-question session.

## Prerequisites
- Completed the U06 Understand It lab (you have the CLEAN vs DIRTY numbers)
- Python 3.10+

## The Build (35 min)

### Step 1: The linter (10 min)
**Claude prompt to use:**
```
Write cache_lint.py with lint_prefix(prefix: str) -> list[str]. Detect these
volatile patterns with regexes, case-insensitive: ISO timestamps
(2026-08-25T14:02 or with space), session ids (session_id: X / session-id=X),
counters (request_count: N), uuids (8+ hex chars with dashes), and epoch
millis (13 consecutive digits). Each finding: "<label> at char <pos>: <match>".
Include a main that lints two built-in prefixes - one clean MedFlow copilot
prompt and one with a timestamp AND a session id prepended - printing PASS
for the clean one and each CACHE-KILLER line for the dirty one, then
exiting nonzero if the dirty prefix passes (self-test the linter).
Standard library only. Return only the code.
```
Run it: the clean prefix passes, the dirty one yields two findings.

### Step 2: The cost comparator (10 min)
**Claude prompt to use:**
```
Add compare_sessions() to cache_lint.py: simulate a 10-call session with a
900-token static prefix and 150 volatile tokens per call, under Anthropic
pricing (input $3/M, cache read $0.30/M, cache write $3.75/M). CLEAN: call 1
pays cache-write on the prefix + input on the rest; calls 2-10 pay cache-read
on the prefix + input on the rest. DIRTY: every call pays full input on
everything. Print a two-row table: total tokens billed as fresh input,
total cost, and the percentage premium DIRTY pays over CLEAN.
```
**Expected output (shape):**
```
session   fresh-input tok   cost      premium
CLEAN            ~2,400     $0.0069      —
DIRTY           ~10,500     $0.0315    ~356%
```
The premium is the number to remember: same context, same answers, ~4.5x the bill.

### Step 3: Break it on purpose (10 min)
Move the timestamp in your dirty prefix from position zero to the very end of the string and re-lint plus re-compare with a `--suffix-volatile` variant (prefix stays clean, volatile tail excluded from the cached block).
**Expected:** the linter still *finds* the timestamp (it is volatile), but the comparator's CLEAN economics return — proving the module's claim that **position, not content, was the problem**. A good lint therefore reports position, and your Step 1 output already does.

### Step 4: Wire it to reality
Point the linter at the real system prompt: `GET http://localhost:8080/api/copilot/ask` responses carry the receipt only, so instead lint the prompt text in `app/api/src/main/resources/` (the copilot prompt file). It must pass clean — if the course's own static surface ever fails its own lint, file that as the bug it is.

## Deliverable
`u06-lab/cache_lint.py` — linter + session comparator + positional break-proof.

## Stretch Goals
- Add a `--fix` mode that rewrites a dirty prefix by moving volatile matches to a `VOLATILE:` tail block, preserving all content.
- Lint the parent kit's M19 lab prefix and your own CLAUDE.md files — volatile tokens hide in respectable places.

## Connection to Next Module
The static surface is now small, right, and cheap. U07 attacks the layers that *do* change per call — budgets, then the compression ladder, and the fidelity assertion that decides whether a saving was real.

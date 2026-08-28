# U03 Lab: Understand It — The Handover Sheet vs the Hallway Tape

## Objective
Run the same three-question review session twice — naive and notes — and watch the write family work: the history layer collapses, the session sparkline flattens, and one 20-token note answers what 1,700 tokens of history answered.

## Prerequisites
- Completed U03 module content; app running in replay mode (U00 lab setup)

## Exercise (25 min)

### Step 1: The hallway tape
In **naive** mode, ask these three in ONE session (keep the same Copilot panel open):
1. Q2 — "Which requests are currently in MANUAL_REVIEW…"
2. Q6 — "Why did PA-1004 go to manual review…"
3. Q9 — "Summarize member M-2001's authorization history…"
**What to observe:** the session strip at the bottom. Each receipt's history layer carries the previous turns; the sparkline climbs. Note the Q9 receipt's history + retrieved lines.

### Step 2: The handover sheet
Refresh the page (new session), switch to **notes** mode, ask the same three questions in order.
**Expected output:** Q9's receipt shows history ≈ 0, a small retrieved-notes line, and a total near **167 tokens · ✓ VERIFIED** (replay grid, synthetic-pre-recording) against naive's ~1,700. The sparkline stays flat.

### Step 3: Read the sheet itself
The module explains the backend appends structured notes after each answer. Ask the copilot (still in notes mode): "What do your session notes currently contain?" — or inspect the receipt's retrieved layer size across the three asks: it grows by tens of tokens per turn, not hundreds.
Find the specific note line that made Q9 cheap (it names PA-1001 and PA-1004 with their outcomes — identifiers, statuses, ~20 tokens).

### Step 4: Find write's failure boundary
Ask a fourth question the notes CANNOT answer: Q1 (procedure criteria — never discussed this session). **What to observe:** notes mode still answers (PASS) but its retrieved layer grows to fetch criteria — the note store isn't magic memory, it's *session* memory; facts never written must still be selected. Write and select are partners, not rivals.

## Reflection Questions
1. The Q9 note cost ~20 tokens to write during turns 1–2. When did that investment break even, and what does that say about short sessions?
2. What exactly would have been lost if the note said "the knee request was reviewed" instead of "PA-1004 | MANUAL_REVIEW | 65"?
3. How does this connect to the ward nurse's handover sheet — and what is the equivalent of a nurse writing "patient seemed fine" instead of vitals?

## Key Insight
Write wins by capturing load-bearing facts at the moment of knowing — structured, identifier-first, and read back small.

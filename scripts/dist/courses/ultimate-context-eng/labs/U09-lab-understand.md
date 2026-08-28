# U09 Lab: Understand It — Isolation's Honest Price Tag

## Objective
Read the isolated mode's receipts without flinching — the most expensive mode on the board for single questions — then compute the break-even turn where isolation's memo starts paying for itself.

## Prerequisites
- Completed U09 module content; app running in replay mode (U00 lab setup)

## Exercise (25 min)

### Step 1: The expensive receipt
Ask **Q9** ("Summarize member M-2001's authorization history…") in `isolated` mode.
**Expected output (replay fixtures, synthetic-pre-recording):**
```
ISOLATED             token receipt
Tool results         (carries the sub-call: briefing + exploration + memo)
Input total          1,796
✓ VERIFIED
vs notes: 167   vs naive: 1,700
```
**What to observe:** the *tool* layer is where the sub-agent's cost landed — MedFlow bills the sub-call there so isolation's price is visible on the receipt instead of hidden in another window.

### Step 2: Confirm it's structural, not bad luck
Ask Q1 and Q10 in isolated mode too (1,808 and 1,802). Every single question pays roughly naive + memo overhead. Single-shot questions are isolation's worst shape — the module said it; your receipts now show it.

### Step 3: The break-even arithmetic
Now do the arithmetic the grid can't show (it measures single questions). Suppose a review session asks **one deep question, then N follow-ups that reuse its findings**:
```
isolated:  1,796 (deep + memo)  +  N × ~(memo 375 + question ~150)
naive:     1,700 (deep)         +  N × (full re-carry, growing ≥1,700/call)
```
Fill the table for N = 1, 2, 3, 5 and find the first N where isolated's cumulative total is lower.
**Expected:** break-even lands around N = 2–3; by N = 5 isolation is far ahead — the memo is re-read, the exploration never is.

### Step 4: The alignment table, from your own numbers
You have now personally measured all three long-horizon techniques: compaction's saw-tooth (U08 build), notes' flat 198 (U08), isolation's pay-now-save-later (this lab). Write Anthropic's alignment table from memory and annotate each row with YOUR number:
```
compaction  ↔ conversational continuity   (your U08 total: ____)
notes       ↔ identifiable milestones     (session total ~1,301)
sub-agents  ↔ parallel/deep exploration   (break-even N: ____)
```

## Reflection Questions
1. If the backend hid the sub-call tokens instead of billing them to the tool layer, what would the grid have claimed about isolated mode — and which course rule would that break?
2. Three sub-agents exploring three members in parallel each return a 375-token memo. What does the *parent's* window carry, and what would it have carried naively?
3. How does this connect to sending the junior to the archives — and what exactly is the two-page memo in your Step 3 arithmetic?

## Key Insight
Isolation is a loan: you pay briefing-plus-memo interest today so the exploration never compounds in your window tomorrow — and the receipt should always show the interest.

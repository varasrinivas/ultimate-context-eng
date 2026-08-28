# U07 Lab: Understand It — Down the Ladder to a Voided Saving

## Objective
Read the same question's receipts down the compression ladder (naive → budgeted → compressed), then meet the course's star exhibit: a 208-token receipt whose stamp voids an 8.2x saving.

## Prerequisites
- Completed U07 module content; app running in replay mode (U00 lab setup)

## Exercise (25 min)

### Step 1: The ladder on a logic question
Ask **Q5** ("Why was PA-1003 denied? Name every missing criterion…") in `naive`, `budgeted`, and `compressed`.
**Expected output (replay fixtures, synthetic-pre-recording):**
```
naive       1,704 tok   ✓
budgeted      569 tok   ✓   (3.0x — whole-record eviction, zero rephrasing risk)
compressed    247 tok   ✓   (6.9x — prune + extract-verbatim + abstract)
```
**What to observe:** all three stamps are ✓. The ladder earned every rung on this question — verify the answer still names the score 25 and both missing criteria verbatim.

### Step 2: Find the verbatim rung in the answer
In the compressed answer, locate the extract-verbatim artifacts: exact request id, exact score, exact criterion names. These survived because the assembler's fidelity assertion requires them to. Underline them — they are what rung 3 is *forbidden* to touch.

### Step 3: The star exhibit
Open the **Compare drawer**, pin **Q9** ("Summarize member M-2001's authorization history…"), and run `compressed` vs `naive`.
**Expected output:**
```
naive        1,700 tok   ✓ VERIFIED
compressed     208 tok   ✗ FAILED — missing: PA-1004, MANUAL_REVIEW, 2
                          SAVINGS VOID
```
**What to observe:** the drawer refuses to celebrate the 8.2x delta. Hover the failed stamp: the abstraction rung swallowed PA-1004 and reported "consistent approvals." (Disclosure the module makes too: this cell is a labeled `synthetic-teaching-failure` fixture — a preserved specimen of the exact failure class the kit's M18 lab produces live.)

### Step 4: Score the mode honestly
From the module's grid, compute compressed's report card: 10 questions, 9 PASS, 1 FAIL → **90% correctness, median 231 tokens on correct answers only**. Now write the one-line summary a dashboard should show for this mode — it must contain both numbers or it is marketing.

## Reflection Questions
1. Budgeted never failed anything yet compressed usually beats it by ~2.4x. State the exact trade a team accepts when moving from rung 1 to rung 3.
2. Q9's failure was invisible in the token count and loud in the key facts. What would your monitoring have to watch to catch it in production?
3. How does this connect to the patient chart — and which line of the one-pager did the nurse-check just catch missing?

## Key Insight
The ladder's savings are real only under the assertion — a compression pipeline without a fidelity check isn't measuring savings, it's measuring shrinkage.

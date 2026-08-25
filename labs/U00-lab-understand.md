# U00 Lab: Understand It — Read Your First Token Receipt

## Objective
Run MedFlow Copilot in replay mode (no API key) and learn to read the Token Lens: what every AI call actually costs, layer by layer, and what the correctness stamp means.

## Prerequisites
- Completed U00 module content
- Java 21, Node 18+, repo cloned (see SETUP.md) — **no API key needed**

## Setup (5 min)
```bash
# terminal 1 — backend, replay mode is the default
cd app/api && ./mvnw spring-boot:run
# terminal 2 — frontend
cd app/ui && npm install && npm run dev
```
Open http://localhost:5173. You should see the Review Queue with three manual-review requests (PA-1002, PA-1004, PA-1010) and the replay-mode banner in the Copilot panel.

## Exercise (20 min)

### Step 1: Ask the naive question
In the Copilot panel, leave the mode on **naive**, pick standing question **Q1** ("Which criteria apply to procedure 72148…"), and press Ask.
**What to observe:** a token receipt appears — an itemized bill for the call.
**Expected output (shape — your replay numbers will match the shipped fixtures):**
```
NAIVE                    token receipt
System                             ~500
Retrieved                        ~4,700
Tool results                     ~1,600
History                          ~1,900
User turn                          ~270
Input total                      ~9,000
Output · Cost · cache read % · latency
✓ VERIFIED
```

### Step 2: Audit the receipt
Add the five layer lines by hand. **They must equal the Input total** — that is the reconciliation rule this course never breaks: if an instrument's parts don't sum to its whole, the instrument is lying.
Then answer: which layer dominates? Why would `naive` mode make *Retrieved* the biggest line for a three-criteria question?

### Step 3: Find the waste
Q1's correct answer needs exactly three criteria names and three weights — roughly 40 tokens of facts. Divide: facts ÷ input total. That ratio (well under 1%) is the course's motivating number — the rest is what Anthropic calls spending your **attention budget** on low-signal tokens.

### Step 4: Meet the stamp
Hover the ✓ VERIFIED stamp. This call was graded against Q1's answer key (`bench/seed/dataset.json → standing_questions`). Now ask a free-form question ("what's the weather?") — the stamp turns **– UNGRADED**. The difference matters: only graded calls can prove a savings claim.

## Reflection Questions
1. If the five layers didn't sum to the input total, what would you stop trusting first — the layers or the total — and why?
2. The facts-to-input ratio was under 1%. What number would convince you a context strategy "works"?
3. How does this connect to reading an itemized restaurant bill — and what's the equivalent of tipping on the pre-discount amount?

## Key Insight
Every AI call has a bill; context engineering starts the moment you itemize it.

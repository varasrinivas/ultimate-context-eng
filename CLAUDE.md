# CLAUDE.md — Ultimate Context Engineering

## Project Identity
This project builds **"Ultimate Context Engineering: Master the Discipline on an App that Shows Its Tokens"** — a 15-module, 5-track course whose outcome is that a graduate **excels at context engineering**: diagnosing, designing, measuring, and governing everything that enters an LLM's context window. The practice bench is **MedFlow Copilot** (`app/`): a purpose-built prior-auth web app (React + Spring Boot) whose **Token Lens** UI displays, for every AI call, the tokens consumed per context layer, the cost, the cache behavior, and a **correctness badge**.

Successor/synthesis of two parent courses (referenced, not duplicated):
- `../context-eng-kit` — context fundamentals (32 modules; this repo inherits its player format, commands, and 12-rule depth system)
- `../knowledge-graph` — structural graphs, OKF, MCP serving, benchmark discipline (this repo inherits its Honesty Rule and harness)

## The Outcome Model (every module serves one of these)
1. **Diagnose** — five layers, per-layer accounting, rot symptoms, attention budget
2. **Apply the four strategies** — write / select / compress / isolate (the canonical LangChain frame; map all variant taxonomies to it)
3. **Design the static surface** — system-prompt altitude, minimal viable toolset, canonical few-shot, cache-friendly ordering
4. **Run long horizons** — compaction, structured notes, sub-agent isolation, task-context alignment
5. **Govern truth** — grounding ladder, provenance, abstention, fidelity assertions, drift/freshness
6. **Measure professionally** — per-call TokenReceipts, multi-arm fresh-session medians, honest reading of published claims

## Non-negotiable rules
1. **Kit depth rules inherited** (analogy first; familiar domains; concrete example per concept; two labs per module — "Understand It" observes a failure, "Build It with AI" constructs with verbatim Claude prompts; SVG diagrams inline; anti-patterns section; one-sentence takeaway; quizzes test WHEN/WHY).
2. **Honesty Rule inherited**: every benchmark number states its conditions; vendor claims paired with replicated ranges; the Three Quantities (mechanical floor / others' sessions / your stack live) framing wherever numbers appear; expected failures are kept and taught, never hidden.
3. **Correctness gates savings**: no token number is reported without its correctness verdict. `bench/verify.py` grades every arm × every standing question against keys derived from `bench/seed/dataset.json`. An arm that saves tokens but drops a key fact is **FAILED — savings void**. The router routes only among correct arms.
4. **One source of truth**: `bench/seed/dataset.json` feeds the backend H2 load, the answer-key generator, and every number cited in modules. Course tables are regenerated from `bench/results/*.json`, never typed by hand.
5. **Replay-first**: the app and every lab must work with NO API key (recorded fixtures); live mode is optional depth.
6. **Canon citations**: each module cites its sources from `docs/canon.md` (Anthropic effective-context-engineering, LangChain write/select/compress/isolate, context-rot literature).

## Layout
```
app/api        Spring Boot 3 backend — domain + ContextAssembler (10 modes) + TokenReceipt + replay
app/ui         React+TS+Vite frontend — domain screens + Token Lens + Compare drawer
bench/seed     dataset.json (THE contract) · bench/keys · bench/results · bench/fixtures
course/        index.html — single-file player (kit engine: MODS / TRACK_META / renderVisual markers)
labs/          U00..U14 × {understand, build} markdown pairs
walkthroughs/  interactive step-through scenarios (JSON) → see ../shared/walkthrough/README.md
walkthrough/   generated standalone quick-reference page (all scenarios behind tabs)
docs/          canon.md · curriculum-map.md
.claude/commands  plan-module / build-module / validate-module / build-lab (kit-inherited; marker-injection — NEVER rewrite course/index.html wholesale)
```

**Walkthroughs.** Four modules (U02, U05, U07, U10) carry an interactive step-through of a measured
scenario. Content is data in `walkthroughs/*.json`; the runtime is `../shared/walkthrough/`. Add a
mount with `mount_player.py` (inserts one `content` section before that module's first quiz — the
player needs no code change, because it renders `content.body` as raw HTML and the runtime re-mounts
under a MutationObserver). Rebuild both targets after any content change, or they drift:
```
python ../shared/walkthrough/build.py --scenarios "walkthroughs/U*.json" --root . --target course/index.html
python ../shared/walkthrough/build.py --scenarios "walkthroughs/U*.json" --root . --standalone walkthrough/index.html \
    --title "Ultimate Context Engineering — walkthroughs" --back ../index.html
```
Every scenario declares provenance and every number is copied from `bench/results/`. A `measured`
citation that does not resolve **fails the build** — the correctness law, enforced rather than promised.

## ContextAssembler modes (backend `mode` param — curriculum 1:1)
`naive · budgeted · compressed · cached · jit · graph · okf · notes · isolated · routed`

## Commands
Use the kit-inherited commands in `.claude/commands/`; validate modules with `scripts/validate-module.ps1` (20-point checklist, PASS >= 18).

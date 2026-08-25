# Ultimate Context Engineering

**Master the discipline on an app that shows its tokens.**

A 15-module course whose outcome is that you **excel at context engineering** — diagnosing, designing, measuring, and governing everything that enters an LLM's context window. You practice on **MedFlow Copilot**: a purpose-built prior-authorization web app (React + Spring Boot) whose **Token Lens** shows, for every AI call, the tokens consumed per context layer, the cost, the cache behavior — and a **correctness badge**, because savings only count when the answer is right.

## What makes this course different
- **The app is the instrument.** Ten context strategies (`naive → budgeted → compressed → cached → jit → graph → okf → notes → isolated → routed`) are toggles in a real app; flip one and watch the same question cost less — or fail its answer key, visibly.
- **Correctness gates every number.** All 10 standing questions ship deterministic answer keys derived from the seeded data; every strategy × every question is graded; a token saving that drops a key fact is *FAILED — savings void*.
- **Grounded in the canon** (`docs/canon.md`): Anthropic's effective-context-engineering guidance, LangChain's write/select/compress/isolate, context-rot literature — plus two full parent courses as reference depth.
- **Honest by construction**: measured tables regenerate from `bench/results/`; expected failures are kept and taught.

## Layout
| Path | What |
|---|---|
| `app/api`, `app/ui` | MedFlow Copilot backend (Spring Boot 3) and frontend (React+TS) |
| `bench/` | seed contract, answer keys, grader (+selftest), campaign runner, results, replay fixtures |
| `course/index.html` | the single-file course player |
| `labs/` | U00–U14 × {understand, build} lab pairs |
| `docs/` | canon, curriculum map |

## Start
`SETUP.md` — the app runs keyless in replay mode. Course: open `course/index.html`, begin at U00.

Parent courses: [`../context-eng-kit`](../context-eng-kit) (fundamentals) · [`../knowledge-graph`](../knowledge-graph) (structural context & benchmarking).

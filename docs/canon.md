# The Canon — sources this course teaches from

Cited per module by the tags in brackets. Fetched and summarized 2026-08-25.

- **[ANTHROPIC-CE]** *Effective context engineering for AI agents* — Anthropic Engineering.
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
  Definition ("strategically curating the finite set of tokens available during inference"); **attention budget**; **context rot**; the **minimal high-signal** principle; system-prompt **altitude** calibration; tool design (token-efficient returns, minimal viable toolset, no overlapping tools); **canonical few-shot examples** over edge-case lists; **just-in-time context** (lightweight identifiers, load at runtime); **progressive disclosure**; hybrid pre-compute/explore strategies; long-horizon techniques — **compaction**, **structured note-taking (agentic memory)**, **multi-agent architectures** (clean-window sub-agents returning 1–2K-token summaries); **task-context alignment** (compaction ↔ conversational continuity; notes ↔ milestone iteration; sub-agents ↔ parallel research).

- **[LC-WSCI]** *Context Engineering for Agents* — LangChain blog (+ `langchain-ai/context_engineering` repo).
  https://www.langchain.com/blog/context-engineering-for-agents · https://github.com/langchain-ai/context_engineering
  The four canonical strategies: **Write** (persist outside the window: scratchpads, memories), **Select** (pull in only what helps: retrieve wide → rerank narrow), **Compress** (retain only required tokens: summarize, don't accumulate), **Isolate** (split context: clean-window sub-agents returning conclusions).

- **[ROT-LIT]** Context-rot & long-horizon literature: *LOCA-bench* (controllable extreme context growth, arxiv 2602.07962); *Diagnosing and Mitigating Context Rot in Long-horizon Search* (arxiv 2606.29718); *Less Context, Better Agents* (arxiv 2606.10209). Performance degrades with window growth even below the limit; signal-to-noise, not size, is the failure axis.

- **[SG-GUIDE]** *Context Engineering: A Practical Guide for AI Agents (2026)* — Sourcegraph blog.
  https://sourcegraph.com/blog/context-engineering — practitioner framing: context editing/rule-based pruning, context awareness (live capacity feedback), memory tools, programmatic tool calling.

- **[PARENT-KIT]** `../context-eng-kit` — the 32-module fundamentals course (five layers; budgets M03; few-shot bias M07; retrieval M08–M09; shaping M10; fusion/provenance M11; memory M12–M15; positioning M16–M17; compression M18; caching M19; guardrails M20–M23; agent patterns M24–M27; evals/ops M28–M30).

- **[PARENT-KG]** `../knowledge-graph` — structural graphs with provenance (EXTRACTED/INFERRED/AMBIGUOUS), OKF bundles, MCP serving, freshness gates, and the measured multi-arm live benchmarks (spring-framework and priorauth campaigns; the forced-arm canary; the Three Quantities).

- **[TAXONOMY-NOTE]** Variant lever taxonomies mapped in U01: sibling agent-course M03B `add/compress/retrieve/offload`; kit opensource `crop/compress/summarize/select`; canonical frame used here: **write/select/compress/isolate** [LC-WSCI].

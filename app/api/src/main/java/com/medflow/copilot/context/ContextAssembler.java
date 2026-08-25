package com.medflow.copilot.context;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medflow.copilot.domain.AuthRequestEntity;
import com.medflow.copilot.domain.MemberEntity;
import com.medflow.copilot.domain.NoteEntity;
import com.medflow.copilot.domain.ProcedureEntity;
import com.medflow.copilot.repo.*;
import com.medflow.copilot.seed.SeedData;
import com.medflow.copilot.seed.SeedLoader;
import com.medflow.copilot.service.DeterminationService;
import com.medflow.copilot.service.GraphService;
import com.medflow.copilot.service.NotesStore;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Builds the five-layer context for each strategy mode. Every mode is one of
 * the four canonical strategies (write/select/compress/isolate) or the static
 * surface — see docs/curriculum-map.md for the 1:1 mapping.
 */
@Component
public class ContextAssembler {

    public static final String SYSTEM_BASE = """
            You are MedFlow Copilot, assisting prior-authorization reviewers.
            Answer only from the provided context. If a fact is redacted or absent,
            say "insufficient evidence" and name what is missing instead of guessing.
            Be concise and cite request/member IDs verbatim.""";

    private final SeedLoader seedLoader;
    private final AuthRequestRepo requests;
    private final MemberRepo members;
    private final NoteRepo notes;
    private final DeterminationService determinations;
    private final GraphService graph;
    private final NotesStore notesStore;
    private final ObjectMapper mapper = new ObjectMapper();

    public ContextAssembler(SeedLoader seedLoader, AuthRequestRepo requests, MemberRepo members,
                            NoteRepo notes, DeterminationService determinations,
                            GraphService graph, NotesStore notesStore) {
        this.seedLoader = seedLoader;
        this.requests = requests;
        this.members = members;
        this.notes = notes;
        this.determinations = determinations;
        this.graph = graph;
        this.notesStore = notesStore;
    }

    public ContextBundle assemble(Mode mode, String question, String sessionId) {
        return switch (mode) {
            case NAIVE -> naive(question, sessionId);
            case BUDGETED -> budgeted(question, sessionId);
            case COMPRESSED -> compressed(question, sessionId);
            case CACHED -> cached(question, sessionId);
            case JIT -> jit(question, sessionId);
            case GRAPH -> graphMode(question, sessionId);
            case OKF -> okf(question, sessionId);
            case NOTES -> notesMode(question, sessionId);
            case ISOLATED, ROUTED -> throw new IllegalArgumentException(
                    mode + " is orchestrated by CopilotService, not assembled directly");
        };
    }

    // ---------- naive: dump everything ----------
    private ContextBundle naive(String q, String session) {
        return new ContextBundle(SYSTEM_BASE, "FULL DOMAIN DATA (JSON):\n" + domainDumpJson(),
                "", historyText(session), q, false, "naive");
    }

    // ---------- budgeted: per-layer caps, whole-record eviction ----------
    private ContextBundle budgeted(String q, String session) {
        String retrieved = "DOMAIN DATA (budgeted, whole-record eviction, newest ids first):\n"
                + evictToBudget(requestLines(requests.findAll()), 1200)
                + "\nPOLICY: " + policyLine();
        String history = evictToBudget(List.of(historyText(session).split("\n")), 300);
        return new ContextBundle(SYSTEM_BASE, retrieved, "", history, q, false, "budgeted");
    }

    // ---------- compressed: prune -> extract-verbatim -> abstract + fidelity ----------
    private ContextBundle compressed(String q, String session) {
        List<AuthRequestEntity> all = requests.findAll();
        List<AuthRequestEntity> relevant = relevantRequests(q, all);
        List<AuthRequestEntity> pruned = all.stream().filter(r -> !relevant.contains(r)).toList();

        String extracted = relevant.stream()
                .map(r -> String.format("%s | %s | %d | missing: %s", r.id, r.decision, r.score,
                        determinations.missingCriteria(r).stream()
                                .map(c -> c.name).collect(Collectors.joining("; ", "", ""))))
                .collect(Collectors.joining("\n"));
        Map<String, Long> byDecision = pruned.stream()
                .collect(Collectors.groupingBy(r -> r.decision, LinkedHashMap::new, Collectors.counting()));
        String abstractLine = "Other requests (summarized): " + byDecision.entrySet().stream()
                .map(e -> e.getValue() + " " + e.getKey()).collect(Collectors.joining(", "));

        String retrieved = "COMPRESSED VIEW (verbatim lines are load-bearing — never paraphrased):\n"
                + extracted + "\n" + abstractLine + "\nPOLICY: " + policyLine();

        // Fidelity assertion (kit M18): every load-bearing id must survive compression.
        for (AuthRequestEntity r : relevant) {
            if (!retrieved.contains(r.id)) {
                throw new IllegalStateException("FIDELITY VIOLATION: lost id " + r.id + " in compression");
            }
        }
        return new ContextBundle(SYSTEM_BASE, retrieved, "", "", q, false, "compressed");
    }

    // ---------- cached: static-first ordering, prefix marked cacheable ----------
    private ContextBundle cached(String q, String session) {
        String staticBlock = "POLICY (static): " + policyLine() + "\n\nPROCEDURE CATALOG (static):\n"
                + proceduresText();
        String dynamic = "CURRENT REQUESTS:\n" + String.join("\n", requestLines(requests.findAll()));
        return new ContextBundle(SYSTEM_BASE, staticBlock + "\n\n" + dynamic,
                "", historyText(session), q, true, "cached");
    }

    // ---------- jit: identifiers only + on-demand record injection ----------
    private ContextBundle jit(String q, String session) {
        String index = "AVAILABLE RECORDS (identifiers only — full records injected on demand):\n"
                + requests.findAll().stream().map(r -> r.id).collect(Collectors.joining(", "))
                + "\nMembers: " + members.findAll().stream().map(m -> m.id).collect(Collectors.joining(", "));
        // Deterministic second pass: inject only records the question names (or its class needs).
        List<AuthRequestEntity> needed = relevantRequests(q, requests.findAll());
        String injected = needed.isEmpty() ? "(no specific records requested)"
                : "INJECTED RECORDS:\n" + String.join("\n", requestLines(needed));
        return new ContextBundle(SYSTEM_BASE, injected, index, "", q, false, "jit");
    }

    // ---------- graph: provenance-tagged subgraph ----------
    private ContextBundle graphMode(String q, String session) {
        return new ContextBundle(SYSTEM_BASE, graph.subgraphFor(q, determinations),
                "", "", q, false, "graph");
    }

    // ---------- okf: canonical concepts selected by question class ----------
    private ContextBundle okf(String q, String session) {
        SeedData.Policy p = seedLoader.seed().policy();
        String cls = classify(q);
        StringBuilder concepts = new StringBuilder();
        if (cls.equals("abstention")) {
            concepts.append("---\ntype: policy\ntitle: Redaction Rule\n---\n").append(p.redactionRule())
                    .append("\nMember dob fields marked REDACTED must never be stated or guessed.\n");
            concepts.append(memberFactsFor(q));
            concepts.append(notesIndexFor(q));
        } else {
            concepts.append("---\ntype: policy\ntitle: Determination Thresholds\n---\n")
                    .append("auto_approve_threshold: ").append(p.autoApproveThreshold())
                    .append("\nmanual_review_threshold: ").append(p.manualReviewThreshold())
                    .append("\nRule: score >= ").append(p.autoApproveThreshold()).append(" APPROVED; score >= ")
                    .append(p.manualReviewThreshold()).append(" MANUAL_REVIEW; else DENIED.\n");
            concepts.append("---\ntype: policy\ntitle: Eligibility\n---\n").append(p.eligibilityRule()).append("\n");
            if (cls.equals("structural")) concepts.append("---\ntype: catalog\n---\n").append(proceduresText());
        }
        return new ContextBundle(SYSTEM_BASE, "CANONICAL CONCEPTS (OKF):\n" + concepts,
                "", "", q, false, "okf");
    }

    // ---------- notes: structured session memory instead of raw history ----------
    private ContextBundle notesMode(String q, String session) {
        List<String> sessionNotes = notesStore.forSession(session == null ? "default" : session);
        String history = sessionNotes.isEmpty() ? "(no session notes yet)"
                : "SESSION NOTES (structured, written outside the window):\n" + String.join("\n", sessionNotes);
        List<AuthRequestEntity> needed = relevantRequests(q, requests.findAll());
        String retrieved = needed.isEmpty() ? policyLine() : String.join("\n", requestLines(needed));
        return new ContextBundle(SYSTEM_BASE, retrieved, "", history, q, false, "notes");
    }

    // ---------- isolated: sub-task bundle + main bundle ----------
    public ContextBundle isolationSubtask(String q) {
        return new ContextBundle(
                "You are a data-gathering sub-agent. Return ONLY the compact facts needed, max ~1500 tokens.",
                "FULL DOMAIN DATA (JSON):\n" + domainDumpJson(), "", "",
                "Gather every fact needed to answer, with IDs verbatim: " + q,
                false, "isolated-sub");
    }

    public ContextBundle isolatedMain(String q, String subSummary) {
        return new ContextBundle(SYSTEM_BASE, "",
                "SUB-AGENT SUMMARY (clean-window isolation):\n" + truncate(subSummary, 6000),
                "", q, false, "isolated");
    }

    // ---------- routed: classification ----------
    public Mode route(String q) {
        return switch (classify(q)) {
            case "structural" -> Mode.GRAPH;
            case "canonical" -> Mode.OKF;
            case "abstention" -> Mode.OKF;
            case "aggregation" -> Mode.ISOLATED;
            default -> Mode.COMPRESSED; // logic
        };
    }

    public String classify(String q) {
        return seedLoader.seed().standingQuestions().stream()
                .filter(sq -> q.toLowerCase(Locale.ROOT).contains(sq.text().toLowerCase(Locale.ROOT))
                        || sq.id().equalsIgnoreCase(q.trim()))
                .map(SeedData.StandingQuestion::questionClass)
                .findFirst()
                .orElseGet(() -> heuristicClass(q));
    }

    private String heuristicClass(String q) {
        String l = q.toLowerCase(Locale.ROOT);
        if (l.contains("date of birth") || l.contains("dob") || l.contains("note say")) return "abstention";
        if (l.contains("threshold") || l.contains("rule") || l.contains("eligib")) return "canonical";
        if (l.contains("summar") || l.contains("how many") || l.contains("most")) return "aggregation";
        if (l.contains("why")) return "logic";
        return "structural";
    }

    // ---------- shared helpers ----------
    String domainDumpJson() {
        try {
            Map<String, Object> dump = new LinkedHashMap<>();
            dump.put("policy", seedLoader.seed().policy());
            dump.put("procedures", seedLoader.seed().procedures());
            dump.put("members", members.findAll().stream().map(m -> Map.of(
                    "id", m.id, "name", m.name, "plan_tier", m.planTier, "plan_status", m.planStatus,
                    "dob", m.dobRedacted() ? "REDACTED" : m.dob)).toList());
            dump.put("requests", requests.findAll().stream().map(r -> Map.of(
                    "id", r.id, "member", r.member.id, "provider", r.provider.name,
                    "procedure", r.procedure.code, "criteria_met", r.criteriaMet,
                    "score", r.score, "decision", r.decision, "reason", r.reason)).toList());
            dump.put("notes", notes.findAll().stream().map(n -> Map.of(
                    "id", n.id, "request", n.requestId, "author", n.author, "text", n.text)).toList());
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(dump);
        } catch (Exception e) {
            throw new IllegalStateException("domain dump failed", e);
        }
    }

    List<String> requestLines(List<AuthRequestEntity> list) {
        return list.stream().map(r -> String.format(
                "%s member=%s provider=%s procedure=%s score=%d decision=%s reason=%s",
                r.id, r.member.id, r.provider.name, r.procedure.code, r.score, r.decision, r.reason)).toList();
    }

    private List<AuthRequestEntity> relevantRequests(String q, List<AuthRequestEntity> all) {
        Pattern pa = Pattern.compile("PA-\\d{4}", Pattern.CASE_INSENSITIVE);
        Pattern mem = Pattern.compile("M-\\d{4}", Pattern.CASE_INSENSITIVE);
        Matcher m1 = pa.matcher(q);
        java.util.Set<String> ids = new java.util.LinkedHashSet<>();
        while (m1.find()) ids.add(m1.group().toUpperCase(Locale.ROOT));
        Matcher m2 = mem.matcher(q);
        java.util.Set<String> memberIds = new java.util.LinkedHashSet<>();
        while (m2.find()) memberIds.add(m2.group().toUpperCase(Locale.ROOT));
        String lower = q.toLowerCase(Locale.ROOT);
        return all.stream().filter(r -> ids.contains(r.id)
                || memberIds.contains(r.member.id)
                || (lower.contains("manual") && "MANUAL_REVIEW".equals(r.decision))
                || (lower.contains("denied") && "DENIED".equals(r.decision))).toList();
    }

    private String evictToBudget(List<String> lines, int tokenBudget) {
        StringBuilder sb = new StringBuilder();
        int used = 0;
        for (String line : lines) {
            int t = line.length() / 4;
            if (used + t > tokenBudget) break; // whole-record eviction: never truncate mid-record
            sb.append(line).append('\n');
            used += t;
        }
        return sb.toString();
    }

    String policyLine() {
        SeedData.Policy p = seedLoader.seed().policy();
        return "approve >= " + p.autoApproveThreshold() + "; review >= " + p.manualReviewThreshold()
                + "; else deny. Eligibility: " + p.eligibilityRule();
    }

    String proceduresText() {
        StringBuilder sb = new StringBuilder();
        for (SeedData.ProcedureDef p : seedLoader.seed().procedures()) {
            sb.append(p.code()).append(' ').append(p.name()).append(" (").append(p.tier()).append(")\n");
            for (SeedData.Criterion c : p.criteria()) {
                sb.append("  - ").append(c.id()).append(' ').append(c.name())
                        .append(" (weight ").append(c.weight()).append(")\n");
            }
        }
        return sb.toString();
    }

    private String memberFactsFor(String q) {
        StringBuilder sb = new StringBuilder();
        Matcher m = Pattern.compile("M-\\d{4}").matcher(q);
        while (m.find()) {
            members.findById(m.group()).ifPresent(mem -> sb.append("Member ").append(mem.id)
                    .append(": ").append(mem.name).append(", plan ").append(mem.planTier)
                    .append('/').append(mem.planStatus).append(", dob=")
                    .append(mem.dobRedacted() ? "REDACTED" : mem.dob).append('\n'));
        }
        return sb.toString();
    }

    private String notesIndexFor(String q) {
        Matcher m = Pattern.compile("PA-\\d{4}").matcher(q);
        StringBuilder sb = new StringBuilder();
        while (m.find()) {
            String id = m.group();
            List<NoteEntity> found = notes.findByRequestId(id);
            sb.append("Notes on ").append(id).append(": ")
                    .append(found.isEmpty() ? "none recorded" : found.stream()
                            .map(n -> n.author + ": " + n.text).collect(Collectors.joining(" | ")))
                    .append('\n');
        }
        return sb.toString();
    }

    private String historyText(String session) {
        return ""; // raw transcript history is a frontend concern in replay; kept minimal server-side
    }

    private String truncate(String s, int chars) {
        return s.length() <= chars ? s : s.substring(0, chars) + "\n[truncated]";
    }
}

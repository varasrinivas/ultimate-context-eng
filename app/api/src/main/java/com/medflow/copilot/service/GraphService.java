package com.medflow.copilot.service;

import com.medflow.copilot.domain.AuthRequestEntity;
import com.medflow.copilot.domain.CriterionEntity;
import com.medflow.copilot.repo.*;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * In-memory knowledge graph over the seeded domain. Every edge is derived
 * directly from stored records, so it carries the EXTRACTED provenance tag —
 * the graph never guesses (contrast with bare-name code graphs in the KG course).
 * Context for a question = the mentioned entities' subgraph (1 hop).
 */
@Service
public class GraphService {

    private final AuthRequestRepo requests;
    private final MemberRepo members;

    private static final Pattern ENTITY = Pattern.compile(
            "PA-\\d{4}|M-\\d{4}|C-\\d{5}-\\d|\\b(72148|29881|95810)\\b", Pattern.CASE_INSENSITIVE);

    public GraphService(AuthRequestRepo requests, MemberRepo members) {
        this.requests = requests;
        this.members = members;
    }

    /** Render the subgraph around entities mentioned in the question (1-hop). */
    public String subgraphFor(String question, DeterminationService determinations) {
        Set<String> mentioned = new LinkedHashSet<>();
        Matcher m = ENTITY.matcher(question);
        while (m.find()) mentioned.add(m.group().toUpperCase(Locale.ROOT));
        String lower = question.toLowerCase(Locale.ROOT);
        boolean wantReview = lower.contains("manual_review") || lower.contains("manual review");
        boolean wantDenied = lower.contains("denied") || lower.contains("denial");
        boolean wantEligibility = lower.contains("eligib");

        StringBuilder sb = new StringBuilder("KNOWLEDGE GRAPH (every edge EXTRACTED from stored records):\n");
        List<AuthRequestEntity> all = requests.findAll();
        int edges = 0;
        for (AuthRequestEntity r : all) {
            boolean relevant = mentioned.isEmpty() && !wantReview && !wantDenied
                    || mentioned.contains(r.id) || mentioned.contains(r.member.id)
                    || mentioned.contains(r.procedure.code)
                    || (wantReview && "MANUAL_REVIEW".equals(r.decision))
                    || (wantDenied && "DENIED".equals(r.decision))
                    || (wantEligibility && r.reason.startsWith("ELIGIBILITY"));
            if (!relevant) continue;
            sb.append(node(r, determinations));
            edges++;
        }
        if (edges == 0) {
            // graceful widening: nothing matched, include decision index only
            for (AuthRequestEntity r : all) {
                sb.append(String.format("%s -[decided]-> %s (score %d) [EXTRACTED]%n",
                        r.id, r.decision, r.score));
            }
        }
        // member facts for mentioned members (redaction preserved)
        for (String id : mentioned) {
            members.findById(id).ifPresent(mem -> sb.append(String.format(
                    "%s -[plan]-> %s/%s [EXTRACTED]; dob=%s%n",
                    mem.id, mem.planTier, mem.planStatus,
                    mem.dobRedacted() ? "REDACTED" : mem.dob)));
        }
        return sb.toString();
    }

    private String node(AuthRequestEntity r, DeterminationService det) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("%s -[for_member]-> %s (%s) [EXTRACTED]%n", r.id, r.member.id, r.member.name));
        sb.append(String.format("%s -[submitted_by]-> %s [EXTRACTED]%n", r.id, r.provider.name));
        sb.append(String.format("%s -[procedure]-> %s %s [EXTRACTED]%n", r.id, r.procedure.code, r.procedure.name));
        sb.append(String.format("%s -[decided]-> %s (score %d; %s) [EXTRACTED]%n", r.id, r.decision, r.score, r.reason));
        for (CriterionEntity c : det.missingCriteria(r)) {
            sb.append(String.format("%s -[missing]-> %s %s (weight %d) [EXTRACTED]%n", r.id, c.id, c.name, c.weight));
        }
        return sb.toString();
    }
}

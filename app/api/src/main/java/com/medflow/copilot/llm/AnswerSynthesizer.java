package com.medflow.copilot.llm;

import com.medflow.copilot.domain.AuthRequestEntity;
import com.medflow.copilot.repo.*;
import com.medflow.copilot.seed.SeedData;
import com.medflow.copilot.seed.SeedLoader;
import com.medflow.copilot.service.DeterminationService;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Synthesizes deterministic, CORRECT answers for the standing questions so the
 * app works keyless before any live recording exists. Every fact is pulled from
 * the seeded data at runtime (never hardcoded), so seed edits propagate — which
 * is exactly what module U11's drift lab exploits.
 */
@Component
public class AnswerSynthesizer {

    private final SeedLoader seed;
    private final AuthRequestRepo requests;
    private final DeterminationService det;

    public AnswerSynthesizer(SeedLoader seed, AuthRequestRepo requests, DeterminationService det) {
        this.seed = seed;
        this.requests = requests;
        this.det = det;
    }

    public String answerFor(String questionId) {
        SeedData.Policy p = seed.seed().policy();
        return switch (questionId) {
            case "Q1" -> {
                SeedData.ProcedureDef proc = seed.seed().procedures().stream()
                        .filter(x -> x.code().equals("72148")).findFirst().orElseThrow();
                yield "Procedure 72148 (" + proc.name() + ") has " + proc.criteria().size()
                        + " criteria: " + proc.criteria().stream()
                        .map(c -> c.name() + " (weight " + c.weight() + ")")
                        .collect(Collectors.joining("; ")) + ".";
            }
            case "Q2" -> {
                List<AuthRequestEntity> review = requests.findByDecisionOrderById("MANUAL_REVIEW");
                yield "Requests in MANUAL_REVIEW: " + review.stream().map(r -> r.id + " (missing "
                                + det.missingCriteria(r).stream().map(c -> c.name)
                                .collect(Collectors.joining(" and "))
                                + (det.missingCriteria(r).isEmpty() ? "nothing — boundary score" : "") + ")")
                        .collect(Collectors.joining("; ")) + ".";
            }
            case "Q3" -> "Score >= " + p.autoApproveThreshold() + " is auto-approved; score >= "
                    + p.manualReviewThreshold() + " goes to manual review; anything lower is denied. "
                    + "Both thresholds are inclusive.";
            case "Q4" -> "Eligibility: " + p.eligibilityRule()
                    + " In short: the plan must be ACTIVE, and only the PREMIUM tier covers surgical procedures.";
            case "Q5" -> explain("PA-1003");
            case "Q6" -> explain("PA-1004") + " Auto-approval requires " + p.autoApproveThreshold() + ".";
            case "Q7" -> "Insufficient evidence: member M-2003's date of birth is redacted "
                    + "(PHI-minimized field). I cannot state or infer it.";
            case "Q8" -> "There is no note by Dr. Rivera on PA-1010 — insufficient evidence to say "
                    + "what such a note contains.";
            case "Q9" -> {
                List<AuthRequestEntity> hist = requests.findByMemberIdOrderById("M-2001");
                yield "Member M-2001 has " + hist.size() + " authorization requests: "
                        + hist.stream().map(r -> r.id + " " + r.decision + " (score " + r.score + ")")
                        .collect(Collectors.joining("; ")) + ".";
            }
            case "Q10" -> {
                List<AuthRequestEntity> elig = requests.findAll().stream()
                        .filter(r -> r.reason.startsWith("ELIGIBILITY")).toList();
                yield "Eligibility denials: " + elig.stream()
                        .map(r -> r.id + " for member " + r.member.id + " (" + r.reason + ")")
                        .collect(Collectors.joining("; ")) + ".";
            }
            default -> "Replay mode: this free-form question has no recorded fixture yet. "
                    + "Run in live mode (MEDFLOW_LIVE=1 with ANTHROPIC_API_KEY) to ask it, "
                    + "or ask one of the ten standing questions.";
        };
    }

    private String explain(String id) {
        AuthRequestEntity r = requests.findById(id).orElseThrow();
        String missing = det.missingCriteria(r).stream().map(c -> c.name + " (weight " + c.weight + ")")
                .collect(Collectors.joining(" and "));
        return id + " scored " + r.score + " and was " + r.decision + ": " + r.reason
                + (missing.isBlank() ? "" : ". Missing criteria: " + missing) + ".";
    }
}

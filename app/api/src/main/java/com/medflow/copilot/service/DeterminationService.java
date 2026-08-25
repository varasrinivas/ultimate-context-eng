package com.medflow.copilot.service;

import com.medflow.copilot.domain.AuthRequestEntity;
import com.medflow.copilot.domain.CriterionEntity;
import com.medflow.copilot.seed.SeedData;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implements the scoring rule from bench/seed/dataset.json `_contract` EXACTLY:
 * eligibility first (ineligible -> DENIED, reason ELIGIBILITY, score 0);
 * otherwise score = sum of weights of MET criteria;
 * score >= auto_approve_threshold -> APPROVED (inclusive);
 * score >= manual_review_threshold -> MANUAL_REVIEW (inclusive);
 * else DENIED.
 */
@Service
public class DeterminationService {

    /** Tier coverage per the contract's eligibility_rule:
     *  STANDARD covers diagnostics; PREMIUM covers diagnostics and surgical. */
    private static final Map<String, Set<String>> TIER_COVERAGE = Map.of(
            "STANDARD", Set.of("diagnostics"),
            "PREMIUM", Set.of("diagnostics", "surgical"));

    public record Determination(int score, String decision, String reason) {}

    public Determination determine(AuthRequestEntity req, SeedData.Policy policy) {
        if (!"ACTIVE".equals(req.member.planStatus)) {
            return new Determination(0, "DENIED", "ELIGIBILITY: plan status " + req.member.planStatus);
        }
        Set<String> covered = TIER_COVERAGE.getOrDefault(req.member.planTier, Set.of());
        if (!covered.contains(req.procedure.tier)) {
            return new Determination(0, "DENIED",
                    "ELIGIBILITY: plan tier " + req.member.planTier + " does not cover "
                            + req.procedure.tier + " procedures");
        }

        int score = req.procedure.criteria.stream()
                .filter(c -> req.criteriaMet.contains(c.id))
                .mapToInt(c -> c.weight)
                .sum();

        List<CriterionEntity> missing = missingCriteria(req);
        String missingNames = missing.stream().map(c -> c.id + " " + c.name)
                .collect(Collectors.joining(", "));

        if (score >= policy.autoApproveThreshold()) {
            return new Determination(score, "APPROVED",
                    "score " + score + " >= " + policy.autoApproveThreshold());
        }
        if (score >= policy.manualReviewThreshold()) {
            return new Determination(score, "MANUAL_REVIEW",
                    "score " + score + " in [" + policy.manualReviewThreshold() + ","
                            + policy.autoApproveThreshold() + "); missing " + missingNames);
        }
        return new Determination(score, "DENIED",
                "score " + score + " < " + policy.manualReviewThreshold() + "; missing " + missingNames);
    }

    public List<CriterionEntity> missingCriteria(AuthRequestEntity req) {
        return req.procedure.criteria.stream()
                .filter(c -> !req.criteriaMet.contains(c.id))
                .toList();
    }
}

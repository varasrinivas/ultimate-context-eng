package com.medflow.copilot.seed;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/** Mirrors bench/seed/dataset.json — the single source of truth (see _contract). */
@JsonIgnoreProperties(ignoreUnknown = true)
public record SeedData(
        @JsonProperty("_contract") String contract,
        Policy policy,
        List<ProcedureDef> procedures,
        List<Member> members,
        List<Provider> providers,
        @JsonProperty("auth_requests") List<AuthRequest> authRequests,
        List<Note> notes,
        @JsonProperty("standing_questions") List<StandingQuestion> standingQuestions) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Policy(
            @JsonProperty("auto_approve_threshold") int autoApproveThreshold,
            @JsonProperty("manual_review_threshold") int manualReviewThreshold,
            @JsonProperty("eligibility_rule") String eligibilityRule,
            @JsonProperty("confidence_gate") double confidenceGate,
            @JsonProperty("redaction_rule") String redactionRule) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ProcedureDef(String code, String name, String tier, List<Criterion> criteria) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Criterion(String id, String name, int weight) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Member(String id, String name,
                         @JsonProperty("plan_tier") String planTier,
                         @JsonProperty("plan_status") String planStatus,
                         String dob) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Provider(String npi, String name, String specialty) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AuthRequest(String id, String member, String provider, String procedure,
                              @JsonProperty("criteria_met") List<String> criteriaMet,
                              Expected expected) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Expected(int score, String decision, String reason) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Note(String id, String request, String author, String text) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StandingQuestion(String id,
                                   @JsonProperty("class") String questionClass,
                                   String text,
                                   @JsonProperty("key_facts") List<String> keyFacts,
                                   List<String> forbidden) {}
}

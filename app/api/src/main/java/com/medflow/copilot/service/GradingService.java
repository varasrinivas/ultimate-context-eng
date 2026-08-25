package com.medflow.copilot.service;

import com.medflow.copilot.seed.SeedData;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Correctness gates savings (CLAUDE.md rule 3): key_facts are case-insensitive
 * substrings that must ALL appear; forbidden entries are regexes, any match fails.
 */
@Service
public class GradingService {

    public record Grade(boolean graded, String verdict, List<String> missingFacts, List<String> forbiddenHits) {
        public static Grade ungraded() { return new Grade(false, "UNGRADED", List.of(), List.of()); }
    }

    /** Match by id ("Q7"), exact text, or normalized containment either way. */
    public Optional<SeedData.StandingQuestion> match(String question, List<SeedData.StandingQuestion> standing) {
        String norm = normalize(question);
        for (SeedData.StandingQuestion q : standing) {
            if (q.id().equalsIgnoreCase(question.trim())) return Optional.of(q);
        }
        for (SeedData.StandingQuestion q : standing) {
            String qn = normalize(q.text());
            if (qn.equals(norm) || qn.contains(norm) || norm.contains(qn)) return Optional.of(q);
        }
        return Optional.empty();
    }

    public Grade grade(String answer, SeedData.StandingQuestion q) {
        String lower = answer.toLowerCase(Locale.ROOT);
        List<String> missing = new ArrayList<>();
        for (String fact : q.keyFacts()) {
            if (!lower.contains(fact.toLowerCase(Locale.ROOT))) missing.add(fact);
        }
        List<String> hits = new ArrayList<>();
        for (String rx : q.forbidden()) {
            if (Pattern.compile(rx, Pattern.CASE_INSENSITIVE).matcher(answer).find()) hits.add(rx);
        }
        boolean pass = missing.isEmpty() && hits.isEmpty();
        return new Grade(true, pass ? "PASS" : "FAIL", missing, hits);
    }

    private String normalize(String s) {
        return s.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9 ]", " ").replaceAll("\\s+", " ").trim();
    }
}

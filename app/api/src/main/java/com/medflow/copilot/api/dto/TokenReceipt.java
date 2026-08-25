package com.medflow.copilot.api.dto;

import java.util.List;
import java.util.Map;

/**
 * Returned with every copilot answer. layers always sum to inputTokens
 * (inputTokens = total prompt tokens incl. cache-read/created portions).
 */
public record TokenReceipt(
        String mode,
        int inputTokens,
        int outputTokens,
        int cacheReadTokens,
        int cacheCreationTokens,
        double costUsd,
        long latencyMs,
        Map<String, Integer> layers,
        Correctness correctness,
        String source) {

    public record Correctness(boolean graded, String verdict,
                              List<String> missingFacts, List<String> forbiddenHits) {}
}

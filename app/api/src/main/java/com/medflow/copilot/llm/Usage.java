package com.medflow.copilot.llm;

/**
 * Token usage for one model call. inputTokens is the TOTAL prompt tokens
 * entering the window (the five layers always sum to it); cacheReadTokens and
 * cacheCreationTokens describe how much of that total was served from / written
 * to the prompt cache, and price differently.
 */
public record Usage(int inputTokens, int outputTokens, int cacheReadTokens, int cacheCreationTokens) {

    public Usage plus(Usage other) {
        return new Usage(inputTokens + other.inputTokens, outputTokens + other.outputTokens,
                cacheReadTokens + other.cacheReadTokens, cacheCreationTokens + other.cacheCreationTokens);
    }

    /** Sonnet price card: $3/M plain in, $15/M out, $0.30/M cache read, $3.75/M cache write. */
    public double costUsd() {
        int plain = Math.max(0, inputTokens - cacheReadTokens - cacheCreationTokens);
        return (plain * 3.0 + outputTokens * 15.0
                + cacheReadTokens * 0.30 + cacheCreationTokens * 3.75) / 1_000_000.0;
    }

    /** Anthropic reports input_tokens EXCLUDING cache fields; normalize to our total. */
    public static Usage fromAnthropic(int input, int output, int cacheRead, int cacheCreation) {
        return new Usage(input + cacheRead + cacheCreation, output, cacheRead, cacheCreation);
    }
}

package com.medflow.copilot.context;

/**
 * The five layers of context (kit M00): what the model actually sees, split so
 * the TokenReceipt can account per layer. staticPrefixCacheable marks the
 * system+retrieved prefix as a cache_control block (cached mode).
 */
public record ContextBundle(
        String system,
        String retrieved,
        String tool,
        String history,
        String user,
        boolean staticPrefixCacheable,
        String modeLabel) {

    public String fullText() {
        return String.join("\n\n", system, retrieved, tool, history, user);
    }

    public int estimateTokens(String s) { return Math.max(0, s.length() / 4); }

    public int[] layerEstimates() {
        return new int[]{estimateTokens(system), estimateTokens(retrieved),
                estimateTokens(tool), estimateTokens(history), estimateTokens(user)};
    }

    public int totalEstimate() {
        int sum = 0;
        for (int e : layerEstimates()) sum += e;
        return sum;
    }
}

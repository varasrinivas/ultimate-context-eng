package com.medflow.copilot.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * seedPath/fixturesPath default to the repo-relative bench locations so the app
 * works when started from app/api (see SETUP.md). Live mode requires BOTH the
 * ANTHROPIC_API_KEY env var and medflow.live=true (MEDFLOW_LIVE=1).
 */
@ConfigurationProperties(prefix = "medflow")
public record MedflowProperties(
        String seedPath,
        String fixturesPath,
        String model,
        boolean live,
        boolean abstentionEnabled) {

    public MedflowProperties {
        if (seedPath == null) seedPath = "../../bench/seed/dataset.json";
        if (fixturesPath == null) fixturesPath = "../../bench/fixtures";
        if (model == null) model = "claude-sonnet-4-6";
    }
}

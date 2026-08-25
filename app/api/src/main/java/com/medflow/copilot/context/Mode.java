package com.medflow.copilot.context;

import java.util.Locale;

/** The curriculum's strategy toggles, 1:1 with the course modules. */
public enum Mode {
    NAIVE, BUDGETED, COMPRESSED, CACHED, JIT, GRAPH, OKF, NOTES, ISOLATED, ROUTED;

    public static Mode from(String s) {
        if (s == null || s.isBlank()) return NAIVE;
        return Mode.valueOf(s.trim().toUpperCase(Locale.ROOT));
    }

    public String label() { return name().toLowerCase(Locale.ROOT); }
}

package com.medflow.copilot.llm;

import com.medflow.copilot.context.ContextBundle;

public interface LlmGateway {
    /** questionId: standing id (Q1..Q10) or freeform-{sha8}; modeLabel names the fixture. */
    LlmResult complete(ContextBundle bundle, String questionId, String modeLabel);
}

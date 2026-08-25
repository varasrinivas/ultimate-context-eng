package com.medflow.copilot.api.dto;

public interface AskDtos {
    record AskRequest(String question, String mode, String sessionId, String compareWith) {}
    record AskAnswer(String answer, TokenReceipt receipt) {}
    record AskResponse(AskAnswer primary, AskAnswer compare) {}
}

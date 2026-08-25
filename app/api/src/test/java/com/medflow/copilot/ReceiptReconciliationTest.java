package com.medflow.copilot;

import com.medflow.copilot.api.dto.AskDtos;
import com.medflow.copilot.context.Mode;
import com.medflow.copilot.service.CopilotService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/** (b) Reconciliation: for every mode, the five layers sum exactly to inputTokens (replay). */
@SpringBootTest
class ReceiptReconciliationTest {

    @Autowired CopilotService copilot;

    @ParameterizedTest
    @EnumSource(Mode.class)
    void layersSumToInputTokens(Mode mode) {
        AskDtos.AskAnswer a = copilot.askOne("Q1", mode, "recon-test");
        int layerSum = a.receipt().layers().values().stream().mapToInt(Integer::intValue).sum();
        assertThat(layerSum)
                .as("mode %s: layers %s", mode, a.receipt().layers())
                .isEqualTo(a.receipt().inputTokens());
        assertThat(a.receipt().inputTokens()).isPositive();
        assertThat(a.receipt().costUsd()).isPositive();
    }
}

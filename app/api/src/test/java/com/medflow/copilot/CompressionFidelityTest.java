package com.medflow.copilot;

import com.medflow.copilot.context.ContextAssembler;
import com.medflow.copilot.context.ContextBundle;
import com.medflow.copilot.context.Mode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/** (d) Fidelity: compression keeps load-bearing ids verbatim (kit M18 rule). */
@SpringBootTest
class CompressionFidelityTest {

    @Autowired ContextAssembler assembler;

    @Test
    void compressedContextForQ9KeepsMemberRequestIdsVerbatim() {
        String q9 = "Summarize member M-2001's authorization history: how many requests and what were the outcomes?";
        ContextBundle bundle = assembler.assemble(Mode.COMPRESSED, q9, "fidelity-test");
        assertThat(bundle.retrieved()).contains("PA-1001").contains("PA-1004");
    }
}

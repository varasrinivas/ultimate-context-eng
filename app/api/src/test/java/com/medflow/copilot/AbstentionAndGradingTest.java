package com.medflow.copilot;

import com.medflow.copilot.api.dto.AskDtos;
import com.medflow.copilot.context.Mode;
import com.medflow.copilot.seed.SeedData;
import com.medflow.copilot.seed.SeedLoader;
import com.medflow.copilot.service.CopilotService;
import com.medflow.copilot.service.GradingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/** (c) Abstention passes where it should; the grader catches planted fabrication. */
@SpringBootTest
class AbstentionAndGradingTest {

    @Autowired CopilotService copilot;
    @Autowired GradingService grading;
    @Autowired SeedLoader seedLoader;

    @Test
    void q7RefusesInOkfAndRoutedModes() {
        for (Mode mode : new Mode[]{Mode.OKF, Mode.ROUTED}) {
            AskDtos.AskAnswer a = copilot.askOne("Q7", mode, "abstention-test");
            assertThat(a.answer().toLowerCase()).contains("insufficient evidence");
            assertThat(a.receipt().correctness().verdict()).as("mode %s", mode).isEqualTo("PASS");
        }
    }

    @Test
    void graderFailsPlantedFabricatedDob() {
        SeedData.StandingQuestion q7 = seedLoader.seed().standingQuestions().stream()
                .filter(q -> q.id().equals("Q7")).findFirst().orElseThrow();
        GradingService.Grade grade = grading.grade(
                "Member M-2003 was born on 1988-04-12.", q7);
        assertThat(grade.verdict()).isEqualTo("FAIL");
        assertThat(grade.forbiddenHits()).isNotEmpty();   // the DOB-shaped regex fired
        assertThat(grade.missingFacts()).isNotEmpty();    // and the refusal facts are absent
    }

    @Test
    void graderFailsPlantedWrongAnswer() {
        SeedData.StandingQuestion q3 = seedLoader.seed().standingQuestions().stream()
                .filter(q -> q.id().equals("Q3")).findFirst().orElseThrow();
        GradingService.Grade grade = grading.grade(
                "Requests are approved at 70 and reviewed at 60.", q3);
        assertThat(grade.verdict()).isEqualTo("FAIL");
        assertThat(grade.forbiddenHits()).isNotEmpty();
    }
}

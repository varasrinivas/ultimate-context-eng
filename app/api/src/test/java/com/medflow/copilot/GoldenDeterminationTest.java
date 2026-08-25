package com.medflow.copilot;

import com.medflow.copilot.repo.AuthRequestRepo;
import com.medflow.copilot.seed.SeedData;
import com.medflow.copilot.seed.SeedLoader;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/** (a) Golden: computed determinations must equal the seed's expected block for every request. */
@SpringBootTest
class GoldenDeterminationTest {

    @Autowired SeedLoader seedLoader;
    @Autowired AuthRequestRepo requests;

    @Test
    void everyRequestMatchesSeedExpectation() {
        for (SeedData.AuthRequest expected : seedLoader.seed().authRequests()) {
            var entity = requests.findById(expected.id()).orElseThrow();
            assertThat(entity.score)
                    .as("%s score", expected.id())
                    .isEqualTo(expected.expected().score());
            assertThat(entity.decision)
                    .as("%s decision", expected.id())
                    .isEqualTo(expected.expected().decision());
        }
    }
}

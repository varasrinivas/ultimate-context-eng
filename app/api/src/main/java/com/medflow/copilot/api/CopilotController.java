package com.medflow.copilot.api;

import com.medflow.copilot.api.dto.AskDtos;
import com.medflow.copilot.seed.SeedData;
import com.medflow.copilot.seed.SeedLoader;
import com.medflow.copilot.service.CopilotService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/copilot")
public class CopilotController {

    private final CopilotService copilot;
    private final SeedLoader seedLoader;

    public CopilotController(CopilotService copilot, SeedLoader seedLoader) {
        this.copilot = copilot;
        this.seedLoader = seedLoader;
    }

    @PostMapping("/ask")
    public AskDtos.AskResponse ask(@RequestBody AskDtos.AskRequest req) {
        return copilot.ask(req);
    }

    /** The ten standing questions with their classes (keys stay server-side). */
    @GetMapping("/questions")
    public List<QuestionView> questions() {
        return seedLoader.seed().standingQuestions().stream()
                .map(q -> new QuestionView(q.id(), q.questionClass(), q.text())).toList();
    }

    public record QuestionView(String id, String questionClass, String text) {}
}

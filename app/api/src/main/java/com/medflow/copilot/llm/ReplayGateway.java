package com.medflow.copilot.llm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.medflow.copilot.config.MedflowProperties;
import com.medflow.copilot.context.ContextBundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Default gateway: answers from recorded fixtures in bench/fixtures/, and when
 * a fixture is missing it synthesizes a deterministic CORRECT one from the seed
 * (source: "synthetic-pre-recording") and persists it — the app must always
 * work with no API key (CLAUDE.md rule 5).
 */
@Component
public class ReplayGateway implements LlmGateway {
    private static final Logger log = LoggerFactory.getLogger(ReplayGateway.class);

    private final MedflowProperties props;
    private final AnswerSynthesizer synthesizer;
    private final ObjectMapper mapper = new ObjectMapper();

    public ReplayGateway(MedflowProperties props, AnswerSynthesizer synthesizer) {
        this.props = props;
        this.synthesizer = synthesizer;
    }

    @Override
    public LlmResult complete(ContextBundle bundle, String questionId, String modeLabel) {
        Path dir = Path.of(props.fixturesPath()).toAbsolutePath().normalize();
        Path file = dir.resolve(questionId + "-" + modeLabel + ".json");
        try {
            if (Files.exists(file)) {
                JsonNode n = mapper.readTree(Files.readString(file));
                return new LlmResult(n.get("answer").asText(),
                        new Usage(n.get("usage").get("input_tokens").asInt(),
                                n.get("usage").get("output_tokens").asInt(),
                                n.get("usage").path("cache_read_input_tokens").asInt(0),
                                n.get("usage").path("cache_creation_input_tokens").asInt(0)),
                        n.path("source").asText("recorded"));
            }
            String answer = synthesizer.answerFor(questionId);
            int input = bundle.totalEstimate(); // total prompt tokens; layers sum to this
            int cacheCreation = 0;
            if (bundle.staticPrefixCacheable()) {
                // First call writes the static prefix to cache (subset of input; priced at write rate).
                cacheCreation = bundle.estimateTokens(bundle.system())
                        + bundle.estimateTokens(bundle.retrieved()) / 2;
            }
            Usage usage = new Usage(input, Math.max(1, answer.length() / 4), 0, cacheCreation);
            Files.createDirectories(dir);
            ObjectNode out = mapper.createObjectNode();
            out.put("question_id", questionId);
            out.put("mode", modeLabel);
            out.put("answer", answer);
            out.put("source", "synthetic-pre-recording");
            ObjectNode u = out.putObject("usage");
            u.put("input_tokens", usage.inputTokens());
            u.put("output_tokens", usage.outputTokens());
            u.put("cache_read_input_tokens", usage.cacheReadTokens());
            u.put("cache_creation_input_tokens", usage.cacheCreationTokens());
            Files.writeString(file, mapper.writerWithDefaultPrettyPrinter().writeValueAsString(out));
            log.info("Synthesized fixture {}", file.getFileName());
            return new LlmResult(answer, usage, "synthetic-pre-recording");
        } catch (Exception e) {
            throw new IllegalStateException("replay gateway failed for " + file, e);
        }
    }
}

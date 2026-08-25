package com.medflow.copilot.llm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.medflow.copilot.config.MedflowProperties;
import com.medflow.copilot.context.ContextBundle;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

/**
 * Live Anthropic Messages API call. Selected only when ANTHROPIC_API_KEY is set
 * AND medflow.live=true. In cached mode the static prefix (system + first
 * retrieved block) carries cache_control: {type: ephemeral}.
 */
@Component
public class LiveAnthropicGateway implements LlmGateway {

    private final MedflowProperties props;
    private final WebClient client;
    private final ObjectMapper mapper = new ObjectMapper();

    public LiveAnthropicGateway(MedflowProperties props) {
        this.props = props;
        this.client = WebClient.builder()
                .baseUrl("https://api.anthropic.com")
                .codecs(c -> c.defaultCodecs().maxInMemorySize(4 * 1024 * 1024))
                .build();
    }

    @Override
    public LlmResult complete(ContextBundle bundle, String questionId, String modeLabel) {
        String apiKey = System.getenv("ANTHROPIC_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("live mode requires ANTHROPIC_API_KEY");
        }
        ObjectNode body = mapper.createObjectNode();
        body.put("model", props.model());
        body.put("max_tokens", 1024);

        ArrayNode system = body.putArray("system");
        ObjectNode sys = system.addObject();
        sys.put("type", "text");
        sys.put("text", bundle.system());
        if (bundle.staticPrefixCacheable()) {
            sys.putObject("cache_control").put("type", "ephemeral");
        }

        ArrayNode messages = body.putArray("messages");
        ObjectNode userMsg = messages.addObject();
        userMsg.put("role", "user");
        ArrayNode content = userMsg.putArray("content");
        String contextText = String.join("\n\n", bundle.retrieved(), bundle.tool(), bundle.history());
        if (!contextText.isBlank()) {
            ObjectNode ctx = content.addObject();
            ctx.put("type", "text");
            ctx.put("text", contextText);
            if (bundle.staticPrefixCacheable()) {
                ctx.putObject("cache_control").put("type", "ephemeral");
            }
        }
        content.addObject().put("type", "text").put("text", bundle.user());

        JsonNode resp = client.post().uri("/v1/messages")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .header("content-type", "application/json")
                .bodyValue(body.toString())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block(Duration.ofSeconds(120));

        if (resp == null) throw new IllegalStateException("empty response from Anthropic");
        StringBuilder answer = new StringBuilder();
        for (JsonNode block : resp.path("content")) {
            if ("text".equals(block.path("type").asText())) answer.append(block.path("text").asText());
        }
        JsonNode u = resp.path("usage");
        Usage usage = Usage.fromAnthropic(u.path("input_tokens").asInt(),
                u.path("output_tokens").asInt(),
                u.path("cache_read_input_tokens").asInt(0),
                u.path("cache_creation_input_tokens").asInt(0));
        return new LlmResult(answer.toString(), usage, "live");
    }
}

package com.medflow.copilot.service;

import com.medflow.copilot.api.dto.AskDtos;
import com.medflow.copilot.api.dto.TokenReceipt;
import com.medflow.copilot.config.MedflowProperties;
import com.medflow.copilot.context.ContextAssembler;
import com.medflow.copilot.context.ContextBundle;
import com.medflow.copilot.context.Mode;
import com.medflow.copilot.llm.LiveAnthropicGateway;
import com.medflow.copilot.llm.LlmGateway;
import com.medflow.copilot.llm.LlmResult;
import com.medflow.copilot.llm.ReplayGateway;
import com.medflow.copilot.llm.Usage;
import com.medflow.copilot.seed.SeedData;
import com.medflow.copilot.seed.SeedLoader;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/** Orchestrates ask(): mode dispatch (incl. routed + isolated), gateway choice,
 *  receipt assembly with layer reconciliation, correctness grading, notes write-back. */
@Service
public class CopilotService {

    private final MedflowProperties props;
    private final ContextAssembler assembler;
    private final ReplayGateway replay;
    private final LiveAnthropicGateway live;
    private final GradingService grading;
    private final NotesStore notesStore;
    private final SeedLoader seedLoader;

    public CopilotService(MedflowProperties props, ContextAssembler assembler, ReplayGateway replay,
                          LiveAnthropicGateway live, GradingService grading, NotesStore notesStore,
                          SeedLoader seedLoader) {
        this.props = props;
        this.assembler = assembler;
        this.replay = replay;
        this.live = live;
        this.grading = grading;
        this.notesStore = notesStore;
        this.seedLoader = seedLoader;
    }

    public AskDtos.AskResponse ask(AskDtos.AskRequest req) {
        AskDtos.AskAnswer primary = askOne(req.question(), Mode.from(req.mode()), req.sessionId());
        AskDtos.AskAnswer compare = req.compareWith() == null || req.compareWith().isBlank() ? null
                : askOne(req.question(), Mode.from(req.compareWith()), req.sessionId());
        return new AskDtos.AskResponse(primary, compare);
    }

    public AskDtos.AskAnswer askOne(String question, Mode mode, String sessionId) {
        long t0 = System.currentTimeMillis();
        Optional<SeedData.StandingQuestion> standing =
                grading.match(question, seedLoader.seed().standingQuestions());
        String questionId = standing.map(SeedData.StandingQuestion::id)
                .orElseGet(() -> "freeform-" + sha8(question));
        // Standing-question ids may arrive as the bare id ("Q7"); expand to full text.
        String effectiveQuestion = standing.map(SeedData.StandingQuestion::text).orElse(question);

        LlmGateway gateway = liveEnabled() ? live : replay;

        String modeLabel;
        ContextBundle bundle;
        LlmResult result;
        if (mode == Mode.ROUTED) {
            Mode target = assembler.route(effectiveQuestion);
            AskDtos.AskAnswer inner = askOne(effectiveQuestion, target, sessionId);
            TokenReceipt r = inner.receipt();
            return new AskDtos.AskAnswer(inner.answer(), new TokenReceipt(
                    "routed:" + r.mode(), r.inputTokens(), r.outputTokens(), r.cacheReadTokens(),
                    r.cacheCreationTokens(), r.costUsd(), r.latencyMs(), r.layers(),
                    r.correctness(), r.source()));
        } else if (mode == Mode.ISOLATED) {
            ContextBundle sub = assembler.isolationSubtask(effectiveQuestion);
            LlmResult subResult = gateway.complete(sub, questionId, "isolated-sub");
            bundle = assembler.isolatedMain(effectiveQuestion, subResult.answer());
            modeLabel = "isolated";
            LlmResult main = gateway.complete(bundle, questionId, modeLabel);
            // The sub-call is the price of isolation: fold it into the tool layer + totals.
            Usage folded = main.usage().plus(new Usage(subResult.usage().inputTokens(),
                    subResult.usage().outputTokens(), subResult.usage().cacheReadTokens(),
                    subResult.usage().cacheCreationTokens()));
            result = new LlmResult(main.answer(), folded, main.source());
            return finish(effectiveQuestion, standing, bundle, result, modeLabel, t0, sessionId,
                    subResult.usage().inputTokens() + subResult.usage().outputTokens());
        } else {
            bundle = assembler.assemble(mode, effectiveQuestion, sessionId);
            modeLabel = mode.label();
            result = gateway.complete(bundle, questionId, modeLabel);
        }
        return finish(effectiveQuestion, standing, bundle, result, modeLabel, t0, sessionId, 0);
    }

    private AskDtos.AskAnswer finish(String question, Optional<SeedData.StandingQuestion> standing,
                                     ContextBundle bundle, LlmResult result, String modeLabel,
                                     long t0, String sessionId, int extraToolTokens) {
        GradingService.Grade grade = standing
                .map(q -> grading.grade(result.answer(), q))
                .orElse(GradingService.Grade.ungraded());

        Map<String, Integer> layers = reconcileLayers(bundle, result.usage().inputTokens(), extraToolTokens);

        if ("notes".equals(modeLabel)) {
            notesStore.append(sessionId == null ? "default" : sessionId,
                    "- asked[" + standing.map(SeedData.StandingQuestion::id).orElse("freeform")
                            + "] verdict=" + grade.verdict()
                            + " facts=" + firstLine(result.answer(), 160));
        }

        TokenReceipt receipt = new TokenReceipt(modeLabel,
                result.usage().inputTokens(), result.usage().outputTokens(),
                result.usage().cacheReadTokens(), result.usage().cacheCreationTokens(),
                round6(result.usage().costUsd()), System.currentTimeMillis() - t0, layers,
                new TokenReceipt.Correctness(grade.graded(), grade.verdict(),
                        grade.missingFacts(), grade.forbiddenHits()),
                result.source());
        return new AskDtos.AskAnswer(result.answer(), receipt);
    }

    /** Scale layer estimates proportionally so they sum EXACTLY to inputTokens. */
    static Map<String, Integer> reconcileLayers(ContextBundle bundle, int inputTokens, int extraToolTokens) {
        String[] names = {"system", "retrieved", "tool", "history", "user"};
        int[] est = bundle.layerEstimates();
        est[2] += extraToolTokens; // isolated: sub-call cost accounted as tool work
        long total = 0;
        for (int e : est) total += e;
        Map<String, Integer> out = new LinkedHashMap<>();
        if (total == 0) {
            out.put("user", inputTokens);
            for (String n : names) out.putIfAbsent(n, 0);
            return out;
        }
        int assigned = 0, maxIdx = 0;
        int[] scaled = new int[5];
        for (int i = 0; i < 5; i++) {
            scaled[i] = (int) ((long) est[i] * inputTokens / total);
            assigned += scaled[i];
            if (est[i] > est[maxIdx]) maxIdx = i;
        }
        scaled[maxIdx] += inputTokens - assigned; // remainder to the largest layer
        for (int i = 0; i < 5; i++) out.put(names[i], scaled[i]);
        return out;
    }

    private boolean liveEnabled() {
        String key = System.getenv("ANTHROPIC_API_KEY");
        return props.live() && key != null && !key.isBlank();
    }

    private static String sha8(String s) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d, 0, 4);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static String firstLine(String s, int max) {
        String one = s.replace('\n', ' ');
        return one.length() <= max ? one : one.substring(0, max);
    }

    private static double round6(double d) { return Math.round(d * 1_000_000d) / 1_000_000d; }
}

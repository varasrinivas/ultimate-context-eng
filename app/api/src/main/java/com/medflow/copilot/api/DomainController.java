package com.medflow.copilot.api;

import com.medflow.copilot.domain.AuthRequestEntity;
import com.medflow.copilot.domain.MemberEntity;
import com.medflow.copilot.repo.*;
import com.medflow.copilot.seed.SeedData;
import com.medflow.copilot.seed.SeedLoader;
import com.medflow.copilot.service.DeterminationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DomainController {

    private final AuthRequestRepo requests;
    private final MemberRepo members;
    private final NoteRepo notes;
    private final DeterminationService det;
    private final SeedLoader seedLoader;

    public DomainController(AuthRequestRepo requests, MemberRepo members, NoteRepo notes,
                            DeterminationService det, SeedLoader seedLoader) {
        this.requests = requests;
        this.members = members;
        this.notes = notes;
        this.det = det;
        this.seedLoader = seedLoader;
    }

    @GetMapping("/queue")
    public List<Map<String, Object>> queue() {
        return requests.findByDecisionOrderById("MANUAL_REVIEW").stream()
                .map(this::requestSummary).toList();
    }

    @GetMapping("/requests")
    public List<Map<String, Object>> allRequests() {
        return requests.findAll().stream().map(this::requestSummary).toList();
    }

    @GetMapping("/requests/{id}")
    public Map<String, Object> request(@PathVariable String id) {
        AuthRequestEntity r = requests.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "unknown request " + id));
        Map<String, Object> m = requestSummary(r);
        m.put("criteria", r.procedure.criteria.stream().map(c -> Map.of(
                "id", c.id, "name", c.name, "weight", c.weight,
                "met", r.criteriaMet.contains(c.id))).toList());
        m.put("notes", notes.findByRequestId(id).stream()
                .map(n -> Map.of("author", n.author, "text", n.text)).toList());
        return m;
    }

    @GetMapping("/members/{id}")
    public Map<String, Object> member(@PathVariable String id) {
        MemberEntity m = members.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "unknown member " + id));
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", m.id);
        out.put("name", m.name);
        out.put("planTier", m.planTier);
        out.put("planStatus", m.planStatus);
        out.put("dob", m.dobRedacted() ? "REDACTED" : m.dob);
        out.put("history", requests.findByMemberIdOrderById(id).stream()
                .map(this::requestSummary).toList());
        return out;
    }

    @GetMapping("/policy")
    public SeedData.Policy policy() { return seedLoader.seed().policy(); }

    private Map<String, Object> requestSummary(AuthRequestEntity r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", r.id);
        m.put("memberId", r.member.id);
        m.put("memberName", r.member.name);
        m.put("provider", r.provider.name);
        m.put("procedureCode", r.procedure.code);
        m.put("procedureName", r.procedure.name);
        m.put("score", r.score);
        m.put("decision", r.decision);
        m.put("reason", r.reason);
        m.put("missingCriteria", det.missingCriteria(r).stream().map(c -> c.name).toList());
        return m;
    }
}

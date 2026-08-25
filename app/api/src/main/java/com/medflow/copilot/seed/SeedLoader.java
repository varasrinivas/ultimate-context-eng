package com.medflow.copilot.seed;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medflow.copilot.config.MedflowProperties;
import com.medflow.copilot.domain.AuthRequestEntity;
import com.medflow.copilot.domain.CriterionEntity;
import com.medflow.copilot.domain.MemberEntity;
import com.medflow.copilot.domain.NoteEntity;
import com.medflow.copilot.domain.ProcedureEntity;
import com.medflow.copilot.domain.ProviderEntity;
import com.medflow.copilot.repo.*;
import com.medflow.copilot.service.DeterminationService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Loads bench/seed/dataset.json (THE contract) into H2 at boot and keeps the
 * parsed SeedData available as the in-memory authority for the ContextAssembler,
 * grading, and policy endpoints. Fails fast if the seed is missing — a copilot
 * with no ground truth is exactly the silent failure this course teaches against.
 */
@Component
public class SeedLoader {
    private static final Logger log = LoggerFactory.getLogger(SeedLoader.class);

    private final MedflowProperties props;
    private final DeterminationService determinations;
    private final MemberRepo members;
    private final ProviderRepo providers;
    private final ProcedureRepo procedures;
    private final CriterionRepo criteria;
    private final AuthRequestRepo requests;
    private final NoteRepo notes;

    private SeedData seed;

    public SeedLoader(MedflowProperties props, DeterminationService determinations,
                      MemberRepo members, ProviderRepo providers, ProcedureRepo procedures,
                      CriterionRepo criteria, AuthRequestRepo requests, NoteRepo notes) {
        this.props = props;
        this.determinations = determinations;
        this.members = members;
        this.providers = providers;
        this.procedures = procedures;
        this.criteria = criteria;
        this.requests = requests;
        this.notes = notes;
    }

    public SeedData seed() { return seed; }

    @PostConstruct
    @Transactional
    public void load() throws Exception {
        Path path = Path.of(props.seedPath()).toAbsolutePath().normalize();
        if (!Files.exists(path)) {
            throw new IllegalStateException("Seed dataset not found at " + path
                    + " — set medflow.seed-path (see SETUP.md)");
        }
        seed = new ObjectMapper().readValue(Files.readString(path), SeedData.class);

        for (SeedData.Member m : seed.members()) {
            MemberEntity e = new MemberEntity();
            e.id = m.id(); e.name = m.name(); e.planTier = m.planTier();
            e.planStatus = m.planStatus(); e.dob = m.dob();
            members.save(e);
        }
        for (SeedData.Provider p : seed.providers()) {
            ProviderEntity e = new ProviderEntity();
            e.npi = p.npi(); e.name = p.name(); e.specialty = p.specialty();
            providers.save(e);
        }
        for (SeedData.ProcedureDef p : seed.procedures()) {
            ProcedureEntity e = new ProcedureEntity();
            e.code = p.code(); e.name = p.name(); e.tier = p.tier();
            e = procedures.save(e);
            for (SeedData.Criterion c : p.criteria()) {
                CriterionEntity ce = new CriterionEntity();
                ce.id = c.id(); ce.name = c.name(); ce.weight = c.weight(); ce.procedure = e;
                criteria.save(ce);
                e.criteria.add(ce);
            }
        }
        for (SeedData.AuthRequest r : seed.authRequests()) {
            AuthRequestEntity e = new AuthRequestEntity();
            e.id = r.id();
            e.member = members.findById(r.member()).orElseThrow();
            e.provider = providers.findById(r.provider()).orElseThrow();
            e.procedure = procedures.findById(r.procedure()).orElseThrow();
            e.criteriaMet = r.criteriaMet();
            DeterminationService.Determination d = determinations.determine(e, seed.policy());
            e.score = d.score(); e.decision = d.decision(); e.reason = d.reason();
            requests.save(e);
        }
        for (SeedData.Note n : seed.notes()) {
            NoteEntity e = new NoteEntity();
            e.id = n.id(); e.requestId = n.request(); e.author = n.author(); e.text = n.text();
            notes.save(e);
        }
        log.info("Seed loaded: {} members, {} requests, {} standing questions from {}",
                seed.members().size(), seed.authRequests().size(),
                seed.standingQuestions().size(), path);
    }
}

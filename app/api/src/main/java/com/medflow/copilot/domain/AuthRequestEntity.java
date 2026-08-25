package com.medflow.copilot.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "auth_requests")
public class AuthRequestEntity {
    @Id public String id;

    @ManyToOne @JoinColumn(name = "member_id") public MemberEntity member;
    @ManyToOne @JoinColumn(name = "provider_npi") public ProviderEntity provider;
    @ManyToOne @JoinColumn(name = "procedure_code") public ProcedureEntity procedure;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "request_criteria_met", joinColumns = @JoinColumn(name = "request_id"))
    @Column(name = "criterion_id")
    @OrderBy
    public List<String> criteriaMet = new ArrayList<>();

    /** Computed at load by DeterminationService — never stored from the seed's `expected`
     *  (the golden test compares this computation AGAINST the seed's expected block). */
    public int score;
    public String decision;
    public String reason;
}

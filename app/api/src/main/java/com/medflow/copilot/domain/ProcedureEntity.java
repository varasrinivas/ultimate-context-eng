package com.medflow.copilot.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "procedure_defs")
public class ProcedureEntity {
    @Id public String code;
    public String name;
    /** "diagnostics" or "surgical" — drives tier coverage in eligibility. */
    public String tier;

    // No cascade: criteria are saved explicitly by SeedLoader. EAGER because the
    // dataset is tiny and services read criteria outside any session (teaching app).
    @OneToMany(mappedBy = "procedure", fetch = jakarta.persistence.FetchType.EAGER)
    @OrderBy("id")
    public List<CriterionEntity> criteria = new ArrayList<>();
}

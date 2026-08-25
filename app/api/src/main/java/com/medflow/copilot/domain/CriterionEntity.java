package com.medflow.copilot.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "criteria")
public class CriterionEntity {
    @Id public String id;
    public String name;
    public int weight;

    @ManyToOne
    @JoinColumn(name = "procedure_code")
    public ProcedureEntity procedure;
}

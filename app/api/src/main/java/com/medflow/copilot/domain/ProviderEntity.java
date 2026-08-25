package com.medflow.copilot.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "providers")
public class ProviderEntity {
    @Id public String npi;
    public String name;
    public String specialty;
}

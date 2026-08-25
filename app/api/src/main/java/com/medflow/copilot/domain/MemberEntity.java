package com.medflow.copilot.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "members")
public class MemberEntity {
    @Id public String id;
    public String name;
    public String planTier;
    public String planStatus;
    /** Stored verbatim; "_redacted" means PHI-minimized — API returns "REDACTED". */
    public String dob;

    public boolean dobRedacted() { return "_redacted".equals(dob); }
}

package com.medflow.copilot.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "clinical_notes")
public class NoteEntity {
    @Id public String id;
    public String requestId;
    public String author;
    @Column(length = 1000) public String text;
}

package com.medflow.copilot.repo;

import com.medflow.copilot.domain.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepo extends JpaRepository<NoteEntity, String> {
    java.util.List<NoteEntity> findByRequestId(String requestId);
}

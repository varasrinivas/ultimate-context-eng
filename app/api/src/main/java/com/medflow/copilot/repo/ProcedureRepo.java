package com.medflow.copilot.repo;

import com.medflow.copilot.domain.ProcedureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureRepo extends JpaRepository<ProcedureEntity, String> {
}

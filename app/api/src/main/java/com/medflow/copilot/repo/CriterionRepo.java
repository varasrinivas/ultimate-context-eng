package com.medflow.copilot.repo;

import com.medflow.copilot.domain.CriterionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CriterionRepo extends JpaRepository<CriterionEntity, String> {
}

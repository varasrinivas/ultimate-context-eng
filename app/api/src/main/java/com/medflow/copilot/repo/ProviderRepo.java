package com.medflow.copilot.repo;

import com.medflow.copilot.domain.ProviderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepo extends JpaRepository<ProviderEntity, String> {
}

package com.medflow.copilot.repo;

import com.medflow.copilot.domain.AuthRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthRequestRepo extends JpaRepository<AuthRequestEntity, String> {
    java.util.List<AuthRequestEntity> findByDecisionOrderById(String decision);
    java.util.List<AuthRequestEntity> findByMemberIdOrderById(String memberId);
}

package com.medflow.copilot.repo;

import com.medflow.copilot.domain.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepo extends JpaRepository<MemberEntity, String> {
}

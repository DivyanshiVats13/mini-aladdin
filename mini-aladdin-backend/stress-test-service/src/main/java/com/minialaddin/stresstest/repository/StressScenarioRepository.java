package com.minialaddin.stresstest.repository;

import com.minialaddin.stresstest.model.StressScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StressScenarioRepository extends JpaRepository<StressScenario, UUID> {

    Optional<StressScenario> findByName(String name);
}

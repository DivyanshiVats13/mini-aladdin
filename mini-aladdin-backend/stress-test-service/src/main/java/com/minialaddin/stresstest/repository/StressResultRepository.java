package com.minialaddin.stresstest.repository;

import com.minialaddin.stresstest.model.StressResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StressResultRepository extends JpaRepository<StressResult, UUID> {

    /** All results for a portfolio, newest first. */
    List<StressResult> findByPortfolioIdOrderByCalculatedAtDesc(UUID portfolioId);

    /** Delete all results for a portfolio (before re-running). */
    void deleteByPortfolioId(UUID portfolioId);
}

package com.minialaddin.risk.repository;

import com.minialaddin.risk.model.RiskReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RiskReportRepository extends JpaRepository<RiskReport, UUID> {

    /** Find the most recent risk report for a portfolio. */
    Optional<RiskReport> findTopByPortfolioIdOrderByCalculatedAtDesc(UUID portfolioId);
}

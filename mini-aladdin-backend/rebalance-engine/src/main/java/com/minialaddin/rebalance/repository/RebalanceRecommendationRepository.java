package com.minialaddin.rebalance.repository;

import com.minialaddin.rebalance.model.RebalanceRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RebalanceRecommendationRepository extends JpaRepository<RebalanceRecommendation, UUID> {

    /** Find all recommendations for a portfolio, newest first. */
    List<RebalanceRecommendation> findByPortfolioIdOrderByCreatedAtDesc(UUID portfolioId);

    /** Delete all recommendations for a portfolio (before regenerating). */
    void deleteByPortfolioId(UUID portfolioId);
}

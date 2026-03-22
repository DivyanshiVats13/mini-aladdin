package com.minialaddin.rebalance.service;

import com.minialaddin.rebalance.engine.DriftCalculator;
import com.minialaddin.rebalance.engine.DriftCalculator.DriftResult;
import com.minialaddin.rebalance.model.RebalanceRecommendation;
import com.minialaddin.rebalance.repository.RebalanceRecommendationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Rebalance service — fetches portfolio data, calculates drift,
 * and generates buy/sell recommendations.
 */
@Service
public class RebalanceService {

    private static final Logger log = LoggerFactory.getLogger(RebalanceService.class);

    @Value("${app.services.portfolio-url:http://localhost:8082}")
    private String portfolioServiceUrl;

    private final RebalanceRecommendationRepository recommendationRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public RebalanceService(RebalanceRecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    /**
     * Analyze portfolio drift and generate recommendations.
     */
    @SuppressWarnings("unchecked")
    @Transactional
    public List<RebalanceRecommendation> analyzeAndRecommend(UUID portfolioId) {
        try {
            // Fetch portfolio with holdings
            String url = portfolioServiceUrl + "/portfolios/" + portfolioId;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !Boolean.TRUE.equals(response.get("success"))) {
                log.warn("Failed to fetch portfolio {} for rebalancing", portfolioId);
                return List.of();
            }

            Map<String, Object> data = (Map<String, Object>) response.get("data");
            List<Map<String, Object>> holdings = (List<Map<String, Object>>) data.get("holdings");
            BigDecimal totalValue = new BigDecimal(data.get("totalValue").toString());

            if (holdings == null || holdings.isEmpty() || totalValue.compareTo(BigDecimal.ZERO) == 0) {
                return List.of();
            }

            // Build current allocation by sector
            Map<String, BigDecimal> currentAllocation = new LinkedHashMap<>();
            for (Map<String, Object> h : holdings) {
                String sector = (String) h.getOrDefault("sector", "Unknown");
                BigDecimal weight = new BigDecimal(h.get("weightPct").toString());
                currentAllocation.merge(sector, weight, BigDecimal::add);
            }

            // Build target allocation (simplified: equal-weight across sectors)
            Set<String> sectors = currentAllocation.keySet();
            BigDecimal equalWeight = BigDecimal.valueOf(100)
                    .divide(BigDecimal.valueOf(sectors.size()), 2, RoundingMode.HALF_UP);
            Map<String, BigDecimal> targetAllocation = new LinkedHashMap<>();
            for (String sector : sectors) {
                targetAllocation.put(sector, equalWeight);
            }

            // Calculate drift
            Map<String, DriftResult> drifts = DriftCalculator.calculateDrift(
                    currentAllocation, targetAllocation, DriftCalculator.DEFAULT_THRESHOLD);

            // Clear old recommendations
            recommendationRepository.deleteByPortfolioId(portfolioId);

            // Generate recommendations for drifted positions
            List<RebalanceRecommendation> recommendations = new ArrayList<>();
            for (DriftResult drift : drifts.values()) {
                if (!drift.needsRebalance())
                    continue;

                String action = drift.driftPct().compareTo(BigDecimal.ZERO) > 0 ? "SELL" : "BUY";
                BigDecimal adjustPct = drift.driftPct().abs();
                BigDecimal adjustValue = totalValue.multiply(adjustPct)
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                String reason = String.format(
                        "%s is %s by %.1f%% (current: %.1f%%, target: %.1f%%). %s ~$%.2f worth.",
                        drift.assetType(),
                        action.equals("SELL") ? "overweight" : "underweight",
                        adjustPct, drift.currentPct(), drift.targetPct(),
                        action, adjustValue);

                RebalanceRecommendation rec = new RebalanceRecommendation(
                        portfolioId,
                        drift.assetType(), // Using sector name as identifier
                        drift.assetType(),
                        action,
                        adjustValue, // Using value as proxy for quantity
                        adjustValue,
                        reason,
                        drift.currentPct(),
                        drift.targetPct(),
                        drift.driftPct());
                recommendations.add(rec);
            }

            return recommendationRepository.saveAll(recommendations);

        } catch (Exception e) {
            log.error("Error generating rebalance recommendations for {}: {}",
                    portfolioId, e.getMessage());
            return List.of();
        }
    }

    /**
     * Get existing recommendations (without recalculating).
     */
    public List<RebalanceRecommendation> getRecommendations(UUID portfolioId) {
        return recommendationRepository.findByPortfolioIdOrderByCreatedAtDesc(portfolioId);
    }
}

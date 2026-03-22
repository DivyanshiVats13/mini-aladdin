package com.minialaddin.risk.service;

import com.minialaddin.risk.engine.RiskCalculator;
import com.minialaddin.risk.engine.SectorConcentrationAnalyzer;
import com.minialaddin.risk.engine.SectorConcentrationAnalyzer.HoldingData;
import com.minialaddin.risk.model.RiskReport;
import com.minialaddin.risk.repository.RiskReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

/**
 * Risk service — orchestrates risk calculations for a portfolio.
 * Calls portfolio-service REST API to get holdings, then computes
 * Beta, Volatility, Sharpe Ratio, VaR, and sector concentration.
 */
@Service
public class RiskService {

    private static final Logger log = LoggerFactory.getLogger(RiskService.class);

    @Value("${app.services.portfolio-url:http://localhost:8082}")
    private String portfolioServiceUrl;

    private final RiskReportRepository riskReportRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public RiskService(RiskReportRepository riskReportRepository) {
        this.riskReportRepository = riskReportRepository;
    }

    /**
     * Calculate a full risk report for a portfolio.
     */
    @SuppressWarnings("unchecked")
    public RiskReport calculateRisk(UUID portfolioId) {
        try {
            // Fetch portfolio summary from portfolio-service
            String url = portfolioServiceUrl + "/portfolios/" + portfolioId;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !Boolean.TRUE.equals(response.get("success"))) {
                log.warn("Failed to fetch portfolio {} from portfolio-service", portfolioId);
                return fallbackReport(portfolioId);
            }

            Map<String, Object> data = (Map<String, Object>) response.get("data");
            if (data == null)
                return fallbackReport(portfolioId);

            List<Map<String, Object>> holdings = (List<Map<String, Object>>) data.get("holdings");
            BigDecimal totalValue = new BigDecimal(data.get("totalValue").toString());

            if (holdings == null || holdings.isEmpty()) {
                return fallbackReport(portfolioId);
            }

            // Build weights and betas
            List<BigDecimal> weights = new ArrayList<>();
            List<BigDecimal> betas = new ArrayList<>();

            for (Map<String, Object> h : holdings) {
                BigDecimal weight = new BigDecimal(h.get("weightPct").toString())
                        .divide(BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP);
                weights.add(weight);
                betas.add(BigDecimal.ONE); // Default beta = 1.0 per asset
            }

            // Calculate risk metrics
            BigDecimal beta = RiskCalculator.calculateBeta(weights, betas);
            BigDecimal volatility = RiskCalculator.calculateVolatility(beta);
            BigDecimal sharpeRatio = RiskCalculator.calculateSharpeRatio(
                    BigDecimal.valueOf(10), // Assumed 10% expected return
                    BigDecimal.valueOf(4.5), // Risk-free rate ~4.5%
                    volatility);
            BigDecimal varDaily = RiskCalculator.calculateVaR(totalValue, volatility);

            // Save and return
            RiskReport report = new RiskReport(
                    portfolioId, beta, volatility, sharpeRatio, varDaily, totalValue);
            return riskReportRepository.save(report);

        } catch (Exception e) {
            log.error("Error calculating risk for portfolio {}: {}", portfolioId, e.getMessage());
            return fallbackReport(portfolioId);
        }
    }

    /**
     * Get sector concentration breakdown for a portfolio.
     */
    @SuppressWarnings("unchecked")
    public Map<String, BigDecimal> getSectorConcentration(UUID portfolioId) {
        try {
            String url = portfolioServiceUrl + "/portfolios/" + portfolioId;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !Boolean.TRUE.equals(response.get("success"))) {
                return Map.of();
            }

            Map<String, Object> data = (Map<String, Object>) response.get("data");
            List<Map<String, Object>> holdings = (List<Map<String, Object>>) data.get("holdings");

            if (holdings == null || holdings.isEmpty())
                return Map.of();

            List<HoldingData> holdingDataList = holdings.stream()
                    .map(h -> new HoldingData(
                            (String) h.get("sector"),
                            new BigDecimal(h.get("marketValue").toString())))
                    .toList();

            return SectorConcentrationAnalyzer.analyze(holdingDataList);

        } catch (Exception e) {
            log.error("Error calculating sector concentration for {}: {}",
                    portfolioId, e.getMessage());
            return Map.of();
        }
    }

    /**
     * Get the most recent risk report (cached result).
     */
    public Optional<RiskReport> getLatestReport(UUID portfolioId) {
        return riskReportRepository.findTopByPortfolioIdOrderByCalculatedAtDesc(portfolioId);
    }

    private RiskReport fallbackReport(UUID portfolioId) {
        return new RiskReport(
                portfolioId,
                BigDecimal.ONE, // beta = 1 (market-like)
                BigDecimal.valueOf(0.20), // 20% volatility
                BigDecimal.ZERO, // sharpe = 0
                BigDecimal.ZERO, // VaR = 0
                BigDecimal.ZERO // value = 0
        );
    }
}

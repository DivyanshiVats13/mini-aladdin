package com.minialaddin.stresstest.service;

import com.minialaddin.stresstest.engine.StressTestEngine;
import com.minialaddin.stresstest.model.StressResult;
import com.minialaddin.stresstest.model.StressScenario;
import com.minialaddin.stresstest.repository.StressResultRepository;
import com.minialaddin.stresstest.repository.StressScenarioRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

/**
 * Stress test service — seeds scenarios, fetches portfolio,
 * applies each scenario, and saves results.
 */
@Service
public class StressTestService {

    private static final Logger log = LoggerFactory.getLogger(StressTestService.class);

    @Value("${app.services.portfolio-url:http://localhost:8082}")
    private String portfolioServiceUrl;

    private final StressScenarioRepository scenarioRepository;
    private final StressResultRepository resultRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public StressTestService(StressScenarioRepository scenarioRepository,
            StressResultRepository resultRepository) {
        this.scenarioRepository = scenarioRepository;
        this.resultRepository = resultRepository;
    }

    /**
     * Seed predefined stress scenarios on first startup.
     */
    @PostConstruct
    public void seedScenarios() {
        if (scenarioRepository.count() > 0)
            return;

        List<StressScenario> scenarios = List.of(
                new StressScenario("2008 Financial Crisis",
                        "Global financial crisis triggered by subprime mortgage collapse",
                        BigDecimal.valueOf(-38.5), BigDecimal.valueOf(-5.0),
                        BigDecimal.valueOf(-10.0), BigDecimal.valueOf(-300), BigDecimal.valueOf(-40.0)),

                new StressScenario("COVID-19 Crash (Mar 2020)",
                        "Rapid market selloff due to global pandemic",
                        BigDecimal.valueOf(-33.9), BigDecimal.valueOf(2.0),
                        BigDecimal.valueOf(-5.0), BigDecimal.valueOf(-150), BigDecimal.valueOf(-30.0)),

                new StressScenario("Dot-com Bubble (2000-2002)",
                        "Technology sector crash after speculative bubble",
                        BigDecimal.valueOf(-49.1), BigDecimal.valueOf(8.0),
                        BigDecimal.valueOf(-3.0), BigDecimal.valueOf(-200), BigDecimal.valueOf(-10.0)),

                new StressScenario("Black Monday (1987)",
                        "Single-day market crash of 22.6%",
                        BigDecimal.valueOf(-22.6), BigDecimal.valueOf(0.0),
                        BigDecimal.valueOf(-2.0), BigDecimal.valueOf(0), BigDecimal.valueOf(-5.0)),

                new StressScenario("Interest Rate Shock (+300bps)",
                        "Sudden 3% rise in interest rates",
                        BigDecimal.valueOf(-15.0), BigDecimal.valueOf(-12.0),
                        BigDecimal.valueOf(-3.0), BigDecimal.valueOf(300), BigDecimal.valueOf(-8.0)),

                new StressScenario("Mild Correction (-10%)",
                        "Typical market correction",
                        BigDecimal.valueOf(-10.0), BigDecimal.valueOf(-2.0),
                        BigDecimal.valueOf(-1.0), BigDecimal.valueOf(-50), BigDecimal.valueOf(-5.0)));

        scenarioRepository.saveAll(scenarios);
        log.info("Seeded {} stress test scenarios", scenarios.size());
    }

    /**
     * Run all stress scenarios against a portfolio.
     */
    @SuppressWarnings("unchecked")
    @Transactional
    public List<StressResult> runStressTests(UUID portfolioId) {
        try {
            // Fetch portfolio value
            String url = portfolioServiceUrl + "/portfolios/" + portfolioId;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !Boolean.TRUE.equals(response.get("success"))) {
                log.warn("Failed to fetch portfolio {} for stress testing", portfolioId);
                return List.of();
            }

            Map<String, Object> data = (Map<String, Object>) response.get("data");
            BigDecimal totalValue = new BigDecimal(data.get("totalValue").toString());

            if (totalValue.compareTo(BigDecimal.ZERO) == 0)
                return List.of();

            // Clear old results
            resultRepository.deleteByPortfolioId(portfolioId);

            // Run each scenario
            List<StressScenario> scenarios = scenarioRepository.findAll();
            List<StressResult> results = new ArrayList<>();

            for (StressScenario scenario : scenarios) {
                // Apply equity shock (simplified: treat entire portfolio as equity)
                BigDecimal stressedValue = StressTestEngine.applyEquityShock(totalValue, scenario);
                BigDecimal impact = stressedValue.subtract(totalValue);
                BigDecimal impactPct = StressTestEngine.calculateImpactPct(totalValue, stressedValue);

                StressResult result = new StressResult(
                        portfolioId, scenario.getId(), scenario.getName(),
                        totalValue, stressedValue, impact, impactPct);
                results.add(result);
            }

            return resultRepository.saveAll(results);

        } catch (Exception e) {
            log.error("Error running stress tests for portfolio {}: {}",
                    portfolioId, e.getMessage());
            return List.of();
        }
    }

    /**
     * Get all predefined scenarios.
     */
    public List<StressScenario> getScenarios() {
        return scenarioRepository.findAll();
    }

    /**
     * Get cached results for a portfolio.
     */
    public List<StressResult> getResults(UUID portfolioId) {
        return resultRepository.findByPortfolioIdOrderByCalculatedAtDesc(portfolioId);
    }
}

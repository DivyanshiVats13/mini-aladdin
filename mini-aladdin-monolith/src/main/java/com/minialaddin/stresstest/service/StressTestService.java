package com.minialaddin.stresstest.service;

import com.minialaddin.common.dto.AssetType;
import com.minialaddin.common.exception.ResourceNotFoundException;
import com.minialaddin.market.service.MarketDataService;
import com.minialaddin.portfolio.model.Asset;
import com.minialaddin.portfolio.model.Holding;
import com.minialaddin.portfolio.model.Portfolio;
import com.minialaddin.portfolio.repository.PortfolioRepository;
import com.minialaddin.stresstest.dto.Scenario;
import com.minialaddin.stresstest.dto.StressTestResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Runs historical crash simulations on a portfolio.
 * Built-in scenarios apply different shock percentages to
 * equity vs. bond/debt holdings.
 */
@Service
public class StressTestService {

    private final PortfolioRepository portfolioRepository;
    private final MarketDataService marketDataService;

    /** Pre-built stress scenarios. */
    private static final List<Scenario> SCENARIOS = List.of(
            new Scenario("crisis-2008", "2008 Financial Crisis",
                    "Simulates the Great Recession — severe equity drawdown with flight to bonds.",
                    -38.0, 5.0),
            new Scenario("covid-2020", "COVID-19 Crash",
                    "Simulates the March 2020 pandemic selloff — sharp equity decline with bond rally.",
                    -34.0, 8.0),
            new Scenario("dotcom-2000", "Dot-com Bust",
                    "Simulates the 2000-2002 tech bubble burst — tech stocks devastated.",
                    -78.0, -20.0),
            new Scenario("rate-hike", "Rate Hike Shock",
                    "Simulates aggressive interest rate increases — bonds and equities both suffer.",
                    -10.0, -15.0),
            new Scenario("stagflation", "Stagflation Scenario",
                    "High inflation with stagnant growth — broad market decline.",
                    -25.0, -10.0)
    );

    public StressTestService(PortfolioRepository portfolioRepository,
                             MarketDataService marketDataService) {
        this.portfolioRepository = portfolioRepository;
        this.marketDataService = marketDataService;
    }

    /**
     * Return all available stress scenarios.
     */
    public List<Scenario> getScenarios() {
        return SCENARIOS;
    }

    /**
     * Run all stress scenarios on a portfolio and return the results.
     */
    public List<StressTestResult> runAllScenarios(UUID portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Portfolio not found: " + portfolioId));

        List<Holding> holdings = portfolio.getHoldings();
        if (holdings.isEmpty()) return List.of();

        // Calculate original portfolio value with per-holding details
        BigDecimal originalValue = BigDecimal.ZERO;
        List<HoldingDetail> details = new ArrayList<>();

        for (Holding h : holdings) {
            Asset asset = h.getAsset();
            BigDecimal price = marketDataService.getPrice(
                    asset.getTicker(), h.getAvgBuyPrice());
            BigDecimal value = h.getQuantity().multiply(price);
            originalValue = originalValue.add(value);
            details.add(new HoldingDetail(asset.getAssetType(), value));
        }

        // Run each scenario
        List<StressTestResult> results = new ArrayList<>();
        BigDecimal origVal = originalValue.setScale(2, RoundingMode.HALF_UP);

        for (Scenario scenario : SCENARIOS) {
            BigDecimal stressedValue = BigDecimal.ZERO;

            for (HoldingDetail detail : details) {
                double shockPct = getShockForAssetType(
                        detail.assetType, scenario.equityShockPct(), scenario.bondShockPct());
                BigDecimal shocked = detail.value.multiply(
                        BigDecimal.ONE.add(BigDecimal.valueOf(shockPct / 100.0)));
                stressedValue = stressedValue.add(shocked);
            }

            stressedValue = stressedValue.setScale(2, RoundingMode.HALF_UP);
            BigDecimal impact = stressedValue.subtract(origVal)
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal impactPct = origVal.compareTo(BigDecimal.ZERO) > 0
                    ? impact.divide(origVal, 6, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            .setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            results.add(new StressTestResult(
                    scenario.name(), origVal, stressedValue, impact, impactPct));
        }

        return results;
    }

    // ── Internal ────────────────────────────────────────────────

    /**
     * Map asset types to equity-like or bond-like shock percentages.
     */
    private double getShockForAssetType(AssetType type, double equityShock, double bondShock) {
        return switch (type) {
            case EQUITY, ETF, MUTUAL_FUND, CRYPTO -> equityShock;
            case BOND, DEBT, CASH -> bondShock;
            case COMMODITY -> equityShock * 0.6; // commodities partially correlated
        };
    }

    private record HoldingDetail(AssetType assetType, BigDecimal value) {}
}

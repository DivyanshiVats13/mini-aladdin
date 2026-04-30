package com.minialaddin.risk.service;

import com.minialaddin.common.exception.ResourceNotFoundException;
import com.minialaddin.market.service.MarketDataService;
import com.minialaddin.portfolio.model.Asset;
import com.minialaddin.portfolio.model.Holding;
import com.minialaddin.portfolio.model.Portfolio;
import com.minialaddin.portfolio.repository.PortfolioRepository;
import com.minialaddin.risk.dto.RiskReport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Calculates portfolio risk metrics:
 *   - Beta (vs S&P 500)
 *   - Annualized Volatility
 *   - Sharpe Ratio
 *   - Value at Risk (VaR) at 95% confidence
 *   - Sector Concentration
 */
@Service
public class RiskService {

    private static final Logger log = LoggerFactory.getLogger(RiskService.class);
    private static final String MARKET_BENCHMARK = "^GSPC"; // S&P 500
    private static final BigDecimal RISK_FREE_RATE = BigDecimal.valueOf(0.05); // 5% annual
    private static final double Z_95 = 1.645; // z-score for 95% VaR
    private static final int TRADING_DAYS = 252;

    private final PortfolioRepository portfolioRepository;
    private final MarketDataService marketDataService;

    public RiskService(PortfolioRepository portfolioRepository,
                       MarketDataService marketDataService) {
        this.portfolioRepository = portfolioRepository;
        this.marketDataService = marketDataService;
    }

    /**
     * Generate a full risk report for a portfolio.
     */
    public RiskReport analyzeRisk(UUID portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Portfolio not found: " + portfolioId));

        List<Holding> holdings = portfolio.getHoldings();
        if (holdings.isEmpty()) {
            return new RiskReport(BigDecimal.ONE, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO);
        }

        // Get portfolio total value (for weighting)
        BigDecimal totalValue = BigDecimal.ZERO;
        Map<Holding, BigDecimal> holdingValues = new LinkedHashMap<>();
        for (Holding h : holdings) {
            BigDecimal price = marketDataService.getPrice(
                    h.getAsset().getTicker(), h.getAvgBuyPrice());
            BigDecimal value = h.getQuantity().multiply(price);
            holdingValues.put(h, value);
            totalValue = totalValue.add(value);
        }

        if (totalValue.compareTo(BigDecimal.ZERO) == 0) {
            return new RiskReport(BigDecimal.ONE, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO);
        }

        // Get market (S&P 500) historical returns
        List<BigDecimal> marketPrices = marketDataService.getHistoricalPrices(MARKET_BENCHMARK, "3mo");
        List<Double> marketReturns = computeReturns(marketPrices);

        // Compute weighted portfolio returns
        int maxDays = marketReturns.size();
        double[] portfolioReturns = new double[maxDays];

        for (Map.Entry<Holding, BigDecimal> entry : holdingValues.entrySet()) {
            Holding h = entry.getKey();
            BigDecimal weight = entry.getValue()
                    .divide(totalValue, 8, RoundingMode.HALF_UP);

            List<BigDecimal> prices = marketDataService.getHistoricalPrices(
                    h.getAsset().getTicker(), "3mo");
            List<Double> returns = computeReturns(prices);

            int days = Math.min(returns.size(), maxDays);
            for (int i = 0; i < days; i++) {
                portfolioReturns[i] += weight.doubleValue() * returns.get(i);
            }
        }

        // ── Calculate metrics ──────────────────────────────

        // Daily volatility
        double meanReturn = mean(portfolioReturns, maxDays);
        double varianceP = variance(portfolioReturns, maxDays, meanReturn);
        double dailyVol = Math.sqrt(varianceP);
        double annualizedVol = dailyVol * Math.sqrt(TRADING_DAYS);

        // Beta
        double meanMarket = mean(marketReturns);
        double covPM = covariance(portfolioReturns, marketReturns, maxDays, meanReturn, meanMarket);
        double varMarket = variance(marketReturns, meanMarket);
        double beta = varMarket > 0 ? covPM / varMarket : 1.0;

        // Sharpe Ratio = (annualized return - risk-free) / annualized vol
        double annualizedReturn = meanReturn * TRADING_DAYS;
        double sharpe = annualizedVol > 0
                ? (annualizedReturn - RISK_FREE_RATE.doubleValue()) / annualizedVol
                : 0;

        // VaR (95%) = portfolio value * z * daily volatility
        double var95 = totalValue.doubleValue() * Z_95 * dailyVol;

        return new RiskReport(
                BigDecimal.valueOf(beta).setScale(4, RoundingMode.HALF_UP),
                BigDecimal.valueOf(annualizedVol).setScale(4, RoundingMode.HALF_UP),
                BigDecimal.valueOf(sharpe).setScale(4, RoundingMode.HALF_UP),
                BigDecimal.valueOf(var95).setScale(2, RoundingMode.HALF_UP));
    }

    /**
     * Sector concentration breakdown (sector → percentage of portfolio value).
     */
    public Map<String, BigDecimal> sectorConcentration(UUID portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Portfolio not found: " + portfolioId));

        List<Holding> holdings = portfolio.getHoldings();
        if (holdings.isEmpty()) return Map.of();

        BigDecimal totalValue = BigDecimal.ZERO;
        Map<String, BigDecimal> sectorValues = new LinkedHashMap<>();

        for (Holding h : holdings) {
            Asset asset = h.getAsset();
            BigDecimal price = marketDataService.getPrice(
                    asset.getTicker(), h.getAvgBuyPrice());
            BigDecimal value = h.getQuantity().multiply(price);
            totalValue = totalValue.add(value);

            String sector = asset.getSector() != null ? asset.getSector() : "Other";
            sectorValues.merge(sector, value, BigDecimal::add);
        }

        if (totalValue.compareTo(BigDecimal.ZERO) == 0) return Map.of();

        Map<String, BigDecimal> result = new LinkedHashMap<>();
        BigDecimal finalTotal = totalValue;
        sectorValues.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .forEach(e -> result.put(e.getKey(),
                        e.getValue().divide(finalTotal, 4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100))
                                .setScale(1, RoundingMode.HALF_UP)));

        return result;
    }

    // ── Statistics helpers ──────────────────────────────────

    private List<Double> computeReturns(List<BigDecimal> prices) {
        if (prices == null || prices.size() < 2) return List.of();
        List<Double> returns = new ArrayList<>();
        for (int i = 1; i < prices.size(); i++) {
            double prev = prices.get(i - 1).doubleValue();
            double curr = prices.get(i).doubleValue();
            returns.add(prev > 0 ? (curr - prev) / prev : 0);
        }
        return returns;
    }

    private double mean(double[] arr, int n) {
        if (n == 0) return 0;
        double sum = 0;
        for (int i = 0; i < n; i++) sum += arr[i];
        return sum / n;
    }

    private double mean(List<Double> list) {
        if (list.isEmpty()) return 0;
        return list.stream().mapToDouble(Double::doubleValue).average().orElse(0);
    }

    private double variance(double[] arr, int n, double mean) {
        if (n < 2) return 0;
        double sum = 0;
        for (int i = 0; i < n; i++) {
            double diff = arr[i] - mean;
            sum += diff * diff;
        }
        return sum / (n - 1);
    }

    private double variance(List<Double> list, double mean) {
        if (list.size() < 2) return 0;
        double sum = 0;
        for (double v : list) {
            double diff = v - mean;
            sum += diff * diff;
        }
        return sum / (list.size() - 1);
    }

    private double covariance(double[] a, List<Double> b, int n,
                               double meanA, double meanB) {
        int len = Math.min(n, b.size());
        if (len < 2) return 0;
        double sum = 0;
        for (int i = 0; i < len; i++) {
            sum += (a[i] - meanA) * (b.get(i) - meanB);
        }
        return sum / (len - 1);
    }
}

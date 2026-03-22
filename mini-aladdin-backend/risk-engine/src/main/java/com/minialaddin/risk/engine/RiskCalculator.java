package com.minialaddin.risk.engine;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.List;

/**
 * Pure financial risk calculation functions.
 * All methods are static — no Spring dependencies.
 */
public final class RiskCalculator {

    private RiskCalculator() {
    }

    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);
    private static final BigDecimal TRADING_DAYS = BigDecimal.valueOf(252);
    private static final BigDecimal Z_95 = BigDecimal.valueOf(1.645); // 95% confidence

    /**
     * Calculate portfolio Beta relative to a benchmark.
     * Beta = Covariance(portfolio, benchmark) / Variance(benchmark)
     *
     * For a simplified approach, we use weighted-average beta of individual
     * holdings.
     * Each holding's beta is assumed to be 1.0 (market-like) unless overridden.
     *
     * @param holdingWeights Weights of each holding (fraction, sums to 1.0)
     * @param holdingBetas   Beta of each holding (default 1.0)
     * @return Weighted portfolio beta
     */
    public static BigDecimal calculateBeta(List<BigDecimal> holdingWeights,
            List<BigDecimal> holdingBetas) {
        if (holdingWeights.isEmpty())
            return BigDecimal.ONE;

        BigDecimal weightedBeta = BigDecimal.ZERO;
        for (int i = 0; i < holdingWeights.size(); i++) {
            BigDecimal weight = holdingWeights.get(i);
            BigDecimal beta = i < holdingBetas.size() ? holdingBetas.get(i) : BigDecimal.ONE;
            weightedBeta = weightedBeta.add(weight.multiply(beta, MC));
        }
        return weightedBeta.setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Calculate annualized volatility from daily returns.
     * Volatility = StdDev(dailyReturns) × sqrt(252)
     *
     * For simplified approach: uses a baseline volatility of 20% (market average)
     * adjusted by portfolio beta.
     *
     * @param beta Portfolio beta
     * @return Annualized volatility as a decimal (e.g., 0.20 = 20%)
     */
    public static BigDecimal calculateVolatility(BigDecimal beta) {
        // Market average annualized volatility ~20%
        BigDecimal marketVol = BigDecimal.valueOf(0.20);
        return beta.multiply(marketVol, MC).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Calculate Sharpe Ratio.
     * Sharpe = (expectedReturn - riskFreeRate) / volatility
     *
     * @param expectedReturnPct Expected annual return (e.g., 10.0 = 10%)
     * @param riskFreeRatePct   Risk-free rate (e.g., 4.5 = 4.5%)
     * @param volatility        Annualized volatility as decimal
     * @return Sharpe Ratio
     */
    public static BigDecimal calculateSharpeRatio(BigDecimal expectedReturnPct,
            BigDecimal riskFreeRatePct,
            BigDecimal volatility) {
        if (volatility.compareTo(BigDecimal.ZERO) == 0)
            return BigDecimal.ZERO;

        BigDecimal excessReturn = expectedReturnPct.subtract(riskFreeRatePct)
                .divide(BigDecimal.valueOf(100), MC);
        return excessReturn.divide(volatility, MC).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Calculate parametric Value-at-Risk (VaR) at 95% confidence.
     * VaR_95 = portfolioValue × volatility × Z_95 / sqrt(252)
     *
     * This gives the maximum expected daily loss at 95% confidence.
     *
     * @param portfolioValue Total portfolio market value
     * @param volatility     Annualized volatility as decimal
     * @return Daily VaR at 95% confidence (positive number = potential loss)
     */
    public static BigDecimal calculateVaR(BigDecimal portfolioValue, BigDecimal volatility) {
        BigDecimal dailyVol = volatility.divide(
                BigDecimal.valueOf(Math.sqrt(TRADING_DAYS.doubleValue())), MC);
        return portfolioValue.multiply(dailyVol, MC)
                .multiply(Z_95, MC)
                .setScale(4, RoundingMode.HALF_UP);
    }
}

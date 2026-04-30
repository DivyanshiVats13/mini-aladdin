package com.minialaddin.risk.dto;

import java.math.BigDecimal;

/**
 * Risk analytics report for a portfolio.
 * Matches the frontend's expected shape in RiskDashboardPage.jsx.
 */
public record RiskReport(
        /** Portfolio beta relative to S&P 500 (1.0 = market-like). */
        BigDecimal beta,

        /** Annualized portfolio volatility (0.25 = 25%). */
        BigDecimal volatility,

        /** Sharpe ratio — risk-adjusted return. */
        BigDecimal sharpeRatio,

        /** Daily Value-at-Risk at 95% confidence (dollar amount). */
        BigDecimal varDaily95) {
}

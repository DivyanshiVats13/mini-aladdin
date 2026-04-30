package com.minialaddin.market.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated dashboard summary across all of a user's portfolios.
 */
public record DashboardSummary(
        BigDecimal totalValue,
        BigDecimal totalCostBasis,
        BigDecimal totalPnL,
        BigDecimal totalPnLPct,
        BigDecimal portfolioBeta,
        BigDecimal sharpeRatio,
        int portfolioCount,
        int holdingCount,
        List<TopHolding> topHoldings) {

    public record TopHolding(
            String ticker,
            String name,
            BigDecimal marketValue,
            BigDecimal pnL,
            BigDecimal pnLPct,
            BigDecimal weightPct) {
    }
}

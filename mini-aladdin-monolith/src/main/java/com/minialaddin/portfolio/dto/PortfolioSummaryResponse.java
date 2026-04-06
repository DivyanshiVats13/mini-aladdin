package com.minialaddin.portfolio.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Summary response for a portfolio including holdings with P&L data.
 */
public record PortfolioSummaryResponse(
        UUID id,
        String name,
        String currency,
        BigDecimal totalValue,
        BigDecimal totalCostBasis,
        BigDecimal totalPnL,
        BigDecimal totalPnLPct,
        List<HoldingSummary> holdings,
        Instant createdAt,
        Instant updatedAt) {
    /**
     * Summary of a single holding within the portfolio.
     */
    public record HoldingSummary(
            UUID holdingId,
            UUID assetId,
            String ticker,
            String assetName,
            String sector,
            BigDecimal quantity,
            BigDecimal avgBuyPrice,
            BigDecimal currentPrice,
            BigDecimal marketValue,
            BigDecimal costBasis,
            BigDecimal pnL,
            BigDecimal pnLPct,
            BigDecimal weightPct) {
    }
}

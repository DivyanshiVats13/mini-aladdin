package com.minialaddin.rebalance.dto;

import java.math.BigDecimal;

/**
 * A single rebalance recommendation — BUY or SELL.
 * Matches the frontend's expected shape in RebalancePage.jsx.
 */
public record RebalanceRecommendation(
        String ticker,
        String action,         // "BUY" or "SELL"
        BigDecimal currentPct,
        BigDecimal targetPct,
        BigDecimal driftPct,
        BigDecimal estimatedValue,
        String reason) {
}

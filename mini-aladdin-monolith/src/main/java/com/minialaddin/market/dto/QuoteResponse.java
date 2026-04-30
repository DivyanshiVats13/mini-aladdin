package com.minialaddin.market.dto;

import java.math.BigDecimal;

/**
 * Real-time price quote for a single ticker.
 */
public record QuoteResponse(
        String ticker,
        BigDecimal price,
        BigDecimal previousClose,
        BigDecimal change,
        BigDecimal changePct,
        String currency) {
}

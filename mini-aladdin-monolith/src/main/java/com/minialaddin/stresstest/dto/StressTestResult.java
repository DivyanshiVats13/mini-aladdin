package com.minialaddin.stresstest.dto;

import java.math.BigDecimal;

/**
 * Result of running a single stress scenario on a portfolio.
 * Matches the frontend's expected shape in StressTestPage.jsx.
 */
public record StressTestResult(
        String scenarioName,
        BigDecimal originalValue,
        BigDecimal stressedValue,
        BigDecimal impactAmount,
        BigDecimal impactPct) {
}

package com.minialaddin.risk.engine;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Analyzes sector concentration within a portfolio.
 * Produces a map of sector → percentage of total portfolio value.
 */
public final class SectorConcentrationAnalyzer {

    private SectorConcentrationAnalyzer() {
    }

    /**
     * Record representing a single holding's data for concentration analysis.
     */
    public record HoldingData(String sector, BigDecimal marketValue) {
    }

    /**
     * Calculate sector concentration percentages.
     *
     * @param holdings List of holdings with sector and market value
     * @return Map of sector name → percentage of total value (sorted by %
     *         descending)
     */
    public static Map<String, BigDecimal> analyze(java.util.List<HoldingData> holdings) {
        if (holdings == null || holdings.isEmpty()) {
            return Map.of();
        }

        // Sum total value
        BigDecimal totalValue = holdings.stream()
                .map(HoldingData::marketValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalValue.compareTo(BigDecimal.ZERO) == 0) {
            return Map.of();
        }

        // Sum value per sector
        Map<String, BigDecimal> sectorValues = new LinkedHashMap<>();
        for (HoldingData h : holdings) {
            String sector = h.sector() != null ? h.sector() : "Unknown";
            sectorValues.merge(sector, h.marketValue(), BigDecimal::add);
        }

        // Convert to percentages, sorted descending by %
        Map<String, BigDecimal> result = new LinkedHashMap<>();
        sectorValues.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .forEach(entry -> {
                    BigDecimal pct = entry.getValue()
                            .divide(totalValue, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            .setScale(2, RoundingMode.HALF_UP);
                    result.put(entry.getKey(), pct);
                });

        return result;
    }
}

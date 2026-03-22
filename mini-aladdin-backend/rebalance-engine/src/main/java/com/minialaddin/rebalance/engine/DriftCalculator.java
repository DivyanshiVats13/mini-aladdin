package com.minialaddin.rebalance.engine;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Calculates drift between current and target allocation percentages.
 * Drift = current% - target%. Positive drift = overweight, negative =
 * underweight.
 */
public final class DriftCalculator {

    private DriftCalculator() {
    }

    /** Default drift threshold above which rebalancing is recommended (2%). */
    public static final BigDecimal DEFAULT_THRESHOLD = BigDecimal.valueOf(2.0);

    /**
     * Record holding drift analysis for one asset type.
     */
    public record DriftResult(
            String assetType,
            BigDecimal currentPct,
            BigDecimal targetPct,
            BigDecimal driftPct,
            boolean needsRebalance) {
    }

    /**
     * Calculate drift for each asset type.
     *
     * @param currentAllocation Map of assetType → current % (e.g., "EQUITY" → 70.0)
     * @param targetAllocation  Map of assetType → target % (e.g., "EQUITY" → 60.0)
     * @param threshold         Minimum drift % to trigger rebalance recommendation
     * @return Map of assetType → DriftResult
     */
    public static Map<String, DriftResult> calculateDrift(
            Map<String, BigDecimal> currentAllocation,
            Map<String, BigDecimal> targetAllocation,
            BigDecimal threshold) {

        Map<String, DriftResult> results = new LinkedHashMap<>();

        // Check all target allocations
        for (Map.Entry<String, BigDecimal> target : targetAllocation.entrySet()) {
            String assetType = target.getKey();
            BigDecimal targetPct = target.getValue();
            BigDecimal currentPct = currentAllocation.getOrDefault(assetType, BigDecimal.ZERO);
            BigDecimal drift = currentPct.subtract(targetPct).setScale(2, RoundingMode.HALF_UP);
            boolean needsRebalance = drift.abs().compareTo(threshold) > 0;

            results.put(assetType, new DriftResult(
                    assetType, currentPct, targetPct, drift, needsRebalance));
        }

        // Check for asset types that are held but have no target (should be 0%)
        for (Map.Entry<String, BigDecimal> current : currentAllocation.entrySet()) {
            if (!targetAllocation.containsKey(current.getKey())) {
                BigDecimal drift = current.getValue().setScale(2, RoundingMode.HALF_UP);
                boolean needsRebalance = drift.abs().compareTo(threshold) > 0;
                results.put(current.getKey(), new DriftResult(
                        current.getKey(), current.getValue(), BigDecimal.ZERO,
                        drift, needsRebalance));
            }
        }

        return results;
    }
}

package com.minialaddin.stresstest.engine;

import com.minialaddin.stresstest.model.StressScenario;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Applies stress scenarios to portfolio positions.
 * Pure calculation logic — no Spring dependencies.
 */
public final class StressTestEngine {

    private StressTestEngine() {
    }

    /**
     * Calculate the stressed value of an equity holding.
     *
     * @param currentValue Current market value of the holding
     * @param scenario     Stress scenario to apply
     * @return Stressed value after applying the equity shock
     */
    public static BigDecimal applyEquityShock(BigDecimal currentValue, StressScenario scenario) {
        if (scenario.getEquityShockPct() == null)
            return currentValue;
        BigDecimal shockMultiplier = BigDecimal.ONE.add(
                scenario.getEquityShockPct().divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP));
        return currentValue.multiply(shockMultiplier).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Calculate the stressed value of a bond holding.
     */
    public static BigDecimal applyBondShock(BigDecimal currentValue, StressScenario scenario) {
        if (scenario.getBondShockPct() == null)
            return currentValue;
        BigDecimal shockMultiplier = BigDecimal.ONE.add(
                scenario.getBondShockPct().divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP));
        return currentValue.multiply(shockMultiplier).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Calculate the stressed value with FX shock (for foreign-denominated assets).
     */
    public static BigDecimal applyFxShock(BigDecimal currentValue, StressScenario scenario) {
        if (scenario.getFxShockPct() == null)
            return currentValue;
        BigDecimal shockMultiplier = BigDecimal.ONE.add(
                scenario.getFxShockPct().divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP));
        return currentValue.multiply(shockMultiplier).setScale(4, RoundingMode.HALF_UP);
    }

    /**
     * Calculate the total portfolio impact.
     *
     * @param originalValue Total portfolio value before shock
     * @param stressedValue Total portfolio value after shock
     * @return Impact as a percentage (negative = loss)
     */
    public static BigDecimal calculateImpactPct(BigDecimal originalValue, BigDecimal stressedValue) {
        if (originalValue.compareTo(BigDecimal.ZERO) == 0)
            return BigDecimal.ZERO;
        return stressedValue.subtract(originalValue)
                .divide(originalValue, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }
}

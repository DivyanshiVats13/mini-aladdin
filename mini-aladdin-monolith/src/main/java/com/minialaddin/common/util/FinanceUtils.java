package com.minialaddin.common.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Currency;
import java.util.Locale;

/**
 * Financial formatting utilities shared across microservices.
 */
public final class FinanceUtils {

    private FinanceUtils() {}

    /** Round to 2 decimal places (HALF_UP, standard for currency). */
    public static BigDecimal roundCurrency(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    /** Calculate percentage change: ((newVal - oldVal) / oldVal) * 100 */
    public static BigDecimal pctChange(BigDecimal oldVal, BigDecimal newVal) {
        if (oldVal.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return newVal.subtract(oldVal)
                .divide(oldVal, 6, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    /** Format a BigDecimal as currency string, e.g. "$1,234.56" */
    public static String formatCurrency(BigDecimal amount, String currencyCode) {
        NumberFormat fmt = NumberFormat.getCurrencyInstance(Locale.US);
        fmt.setCurrency(Currency.getInstance(currencyCode));
        return fmt.format(amount);
    }
}

package com.minialaddin.portfolio.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Request payload for adding a holding to a portfolio.
 */
public record AddHoldingRequest(

        @NotNull(message = "Asset ID is required") UUID assetId,

        @NotNull(message = "Quantity is required") @DecimalMin(value = "0.000001", message = "Quantity must be positive") BigDecimal quantity,

        @NotNull(message = "Average buy price is required") @DecimalMin(value = "0.0001", message = "Buy price must be positive") BigDecimal avgBuyPrice) {
}

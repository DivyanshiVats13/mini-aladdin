package com.minialaddin.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for creating a new portfolio.
 */
public record CreatePortfolioRequest(

        @NotBlank(message = "Portfolio name is required") String name,

        /** Reporting currency, defaults to USD if not provided. */
        String currency) {
    public CreatePortfolioRequest {
        if (currency == null || currency.isBlank()) {
            currency = "USD";
        }
    }
}

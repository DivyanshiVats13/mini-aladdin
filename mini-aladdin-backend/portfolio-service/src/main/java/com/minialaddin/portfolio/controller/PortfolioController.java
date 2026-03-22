package com.minialaddin.portfolio.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.portfolio.dto.AddHoldingRequest;
import com.minialaddin.portfolio.dto.CreatePortfolioRequest;
import com.minialaddin.portfolio.dto.PortfolioSummaryResponse;
import com.minialaddin.portfolio.model.Holding;
import com.minialaddin.portfolio.model.Portfolio;
import com.minialaddin.portfolio.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for portfolio and holdings management.
 */
@RestController
@RequestMapping("/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    /**
     * POST /portfolios — Create a new portfolio.
     * In a real app, userId would come from the JWT. For now, passed as a header.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Portfolio>> createPortfolio(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreatePortfolioRequest request) {
        Portfolio portfolio = portfolioService.createPortfolio(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Portfolio created", portfolio));
    }

    /**
     * GET /portfolios — List all portfolios for a user.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Portfolio>>> listPortfolios(
            @RequestHeader("X-User-Id") UUID userId) {
        List<Portfolio> portfolios = portfolioService.listPortfolios(userId);
        return ResponseEntity.ok(ApiResponse.ok(portfolios));
    }

    /**
     * GET /portfolios/{id} — Get portfolio summary with holdings and P&L.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PortfolioSummaryResponse>> getPortfolio(
            @PathVariable UUID id) {
        PortfolioSummaryResponse summary = portfolioService.getPortfolioSummary(id);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    /**
     * POST /portfolios/{id}/holdings — Add a holding to a portfolio.
     */
    @PostMapping("/{id}/holdings")
    public ResponseEntity<ApiResponse<Holding>> addHolding(
            @PathVariable UUID id,
            @Valid @RequestBody AddHoldingRequest request) {
        Holding holding = portfolioService.addHolding(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Holding added", holding));
    }

    /**
     * DELETE /portfolios/{id}/holdings/{holdingId} — Remove a holding.
     */
    @DeleteMapping("/{id}/holdings/{holdingId}")
    public ResponseEntity<ApiResponse<Void>> removeHolding(
            @PathVariable UUID id,
            @PathVariable UUID holdingId) {
        portfolioService.removeHolding(id, holdingId);
        return ResponseEntity.ok(ApiResponse.ok("Holding removed", null));
    }

    /**
     * DELETE /portfolios/{id} — Delete a portfolio.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePortfolio(@PathVariable UUID id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.ok(ApiResponse.ok("Portfolio deleted", null));
    }
}

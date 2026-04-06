package com.minialaddin.portfolio.controller;

import com.minialaddin.auth.service.JwtService;
import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.portfolio.dto.AddHoldingRequest;
import com.minialaddin.portfolio.dto.CreatePortfolioRequest;
import com.minialaddin.portfolio.dto.PortfolioSummaryResponse;
import com.minialaddin.portfolio.model.Holding;
import com.minialaddin.portfolio.model.Portfolio;
import com.minialaddin.portfolio.service.PortfolioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for portfolio and holdings management.
 * Extracts userId from JWT token automatically.
 */
@RestController
@RequestMapping("/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final JwtService jwtService;

    public PortfolioController(PortfolioService portfolioService,
                               JwtService jwtService) {
        this.portfolioService = portfolioService;
        this.jwtService = jwtService;
    }

    /**
     * POST /portfolios — Create a new portfolio.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Portfolio>> createPortfolio(
            HttpServletRequest request,
            @Valid @RequestBody CreatePortfolioRequest body) {
        UUID userId = extractUserId(request);
        Portfolio portfolio = portfolioService.createPortfolio(userId, body);
        return ResponseEntity.ok(ApiResponse.ok("Portfolio created", portfolio));
    }

    /**
     * GET /portfolios — List all portfolios for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Portfolio>>> listPortfolios(
            HttpServletRequest request) {
        UUID userId = extractUserId(request);
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
            @Valid @RequestBody AddHoldingRequest body) {
        Holding holding = portfolioService.addHolding(id, body);
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

    // ── Helper ──

    private UUID extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String jwt = authHeader.substring(7);
        return UUID.fromString(jwtService.extractUserId(jwt));
    }
}

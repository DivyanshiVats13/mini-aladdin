package com.minialaddin.risk.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.risk.dto.RiskReport;
import com.minialaddin.risk.service.RiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for portfolio risk analytics.
 * Frontend: RiskDashboardPage.jsx
 */
@RestController
@RequestMapping("/risk")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    /**
     * GET /risk/portfolio/{id} — Full risk report (beta, volatility, Sharpe, VaR).
     */
    @GetMapping("/portfolio/{id}")
    public ResponseEntity<ApiResponse<RiskReport>> analyzeRisk(
            @PathVariable UUID id) {
        RiskReport report = riskService.analyzeRisk(id);
        return ResponseEntity.ok(ApiResponse.ok(report));
    }

    /**
     * GET /risk/sector/{id} — Sector concentration breakdown.
     */
    @GetMapping("/sector/{id}")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> sectorConcentration(
            @PathVariable UUID id) {
        Map<String, BigDecimal> sectors = riskService.sectorConcentration(id);
        return ResponseEntity.ok(ApiResponse.ok(sectors));
    }
}

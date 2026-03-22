package com.minialaddin.risk.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.risk.model.RiskReport;
import com.minialaddin.risk.service.RiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for portfolio risk analytics.
 */
@RestController
@RequestMapping("/risk")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    /**
     * GET /risk/portfolio/{id} — Calculate and return a full risk report.
     */
    @GetMapping("/portfolio/{id}")
    public ResponseEntity<ApiResponse<RiskReport>> getRiskReport(@PathVariable UUID id) {
        RiskReport report = riskService.calculateRisk(id);
        return ResponseEntity.ok(ApiResponse.ok(report));
    }

    /**
     * GET /risk/sector/{id} — Get sector concentration breakdown.
     */
    @GetMapping("/sector/{id}")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getSectorConcentration(
            @PathVariable UUID id) {
        Map<String, BigDecimal> sectors = riskService.getSectorConcentration(id);
        return ResponseEntity.ok(ApiResponse.ok(sectors));
    }
}

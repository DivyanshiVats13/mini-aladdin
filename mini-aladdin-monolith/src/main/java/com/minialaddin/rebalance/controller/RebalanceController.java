package com.minialaddin.rebalance.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.rebalance.dto.RebalanceRecommendation;
import com.minialaddin.rebalance.service.RebalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for portfolio rebalancing.
 * Frontend: RebalancePage.jsx
 */
@RestController
@RequestMapping("/rebalance")
public class RebalanceController {

    private final RebalanceService rebalanceService;

    public RebalanceController(RebalanceService rebalanceService) {
        this.rebalanceService = rebalanceService;
    }

    /**
     * GET /rebalance/portfolio/{id} — Drift analysis & rebalance recommendations.
     */
    @GetMapping("/portfolio/{id}")
    public ResponseEntity<ApiResponse<List<RebalanceRecommendation>>> analyze(
            @PathVariable UUID id) {
        List<RebalanceRecommendation> recs = rebalanceService.analyze(id);
        return ResponseEntity.ok(ApiResponse.ok(recs));
    }
}

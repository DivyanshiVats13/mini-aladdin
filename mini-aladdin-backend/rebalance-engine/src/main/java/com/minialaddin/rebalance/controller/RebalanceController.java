package com.minialaddin.rebalance.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.rebalance.model.RebalanceRecommendation;
import com.minialaddin.rebalance.service.RebalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for portfolio rebalancing.
 */
@RestController
@RequestMapping("/rebalance")
public class RebalanceController {

    private final RebalanceService rebalanceService;

    public RebalanceController(RebalanceService rebalanceService) {
        this.rebalanceService = rebalanceService;
    }

    /**
     * GET /rebalance/portfolio/{id} — Analyze drift and generate recommendations.
     */
    @GetMapping("/portfolio/{id}")
    public ResponseEntity<ApiResponse<List<RebalanceRecommendation>>> getRecommendations(
            @PathVariable UUID id) {
        List<RebalanceRecommendation> recs = rebalanceService.analyzeAndRecommend(id);
        return ResponseEntity.ok(ApiResponse.ok(recs));
    }

    /**
     * POST /rebalance/execute/{id} — Re-generate recommendations (trigger rebalance
     * analysis).
     */
    @PostMapping("/execute/{id}")
    public ResponseEntity<ApiResponse<List<RebalanceRecommendation>>> executeRebalance(
            @PathVariable UUID id) {
        List<RebalanceRecommendation> recs = rebalanceService.analyzeAndRecommend(id);
        return ResponseEntity.ok(ApiResponse.ok("Rebalance analysis complete", recs));
    }
}

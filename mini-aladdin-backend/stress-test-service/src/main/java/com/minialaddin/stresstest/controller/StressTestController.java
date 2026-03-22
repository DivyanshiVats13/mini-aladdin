package com.minialaddin.stresstest.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.stresstest.model.StressResult;
import com.minialaddin.stresstest.model.StressScenario;
import com.minialaddin.stresstest.service.StressTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for stress testing portfolios.
 */
@RestController
@RequestMapping("/stress-test")
public class StressTestController {

    private final StressTestService stressTestService;

    public StressTestController(StressTestService stressTestService) {
        this.stressTestService = stressTestService;
    }

    /**
     * GET /stress-test/scenarios — List all available stress scenarios.
     */
    @GetMapping("/scenarios")
    public ResponseEntity<ApiResponse<List<StressScenario>>> getScenarios() {
        List<StressScenario> scenarios = stressTestService.getScenarios();
        return ResponseEntity.ok(ApiResponse.ok(scenarios));
    }

    /**
     * POST /stress-test/run/{portfolioId} — Run all scenarios against a portfolio.
     */
    @PostMapping("/run/{portfolioId}")
    public ResponseEntity<ApiResponse<List<StressResult>>> runStressTests(
            @PathVariable UUID portfolioId) {
        List<StressResult> results = stressTestService.runStressTests(portfolioId);
        return ResponseEntity.ok(ApiResponse.ok("Stress tests completed", results));
    }

    /**
     * GET /stress-test/results/{portfolioId} — Get cached stress test results.
     */
    @GetMapping("/results/{portfolioId}")
    public ResponseEntity<ApiResponse<List<StressResult>>> getResults(
            @PathVariable UUID portfolioId) {
        List<StressResult> results = stressTestService.getResults(portfolioId);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}

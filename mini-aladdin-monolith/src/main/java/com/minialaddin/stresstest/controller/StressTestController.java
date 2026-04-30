package com.minialaddin.stresstest.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.stresstest.dto.Scenario;
import com.minialaddin.stresstest.dto.StressTestResult;
import com.minialaddin.stresstest.service.StressTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for portfolio stress testing.
 * Frontend: StressTestPage.jsx
 */
@RestController
@RequestMapping("/stress-test")
public class StressTestController {

    private final StressTestService stressTestService;

    public StressTestController(StressTestService stressTestService) {
        this.stressTestService = stressTestService;
    }

    /**
     * GET /stress-test/scenarios — List all available crash scenarios.
     */
    @GetMapping("/scenarios")
    public ResponseEntity<ApiResponse<List<Scenario>>> getScenarios() {
        List<Scenario> scenarios = stressTestService.getScenarios();
        return ResponseEntity.ok(ApiResponse.ok(scenarios));
    }

    /**
     * POST /stress-test/run/{portfolioId} — Run all scenarios on a portfolio.
     */
    @PostMapping("/run/{portfolioId}")
    public ResponseEntity<ApiResponse<List<StressTestResult>>> runStressTests(
            @PathVariable UUID portfolioId) {
        List<StressTestResult> results = stressTestService.runAllScenarios(portfolioId);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}

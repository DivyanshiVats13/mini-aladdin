package com.minialaddin.stresstest.dto;

/**
 * A predefined stress-test scenario — e.g. "2008 Financial Crisis".
 * Matches the frontend's expected shape in StressTestPage.jsx.
 */
public record Scenario(
        String id,
        String name,
        String description,
        double equityShockPct,
        double bondShockPct) {
}

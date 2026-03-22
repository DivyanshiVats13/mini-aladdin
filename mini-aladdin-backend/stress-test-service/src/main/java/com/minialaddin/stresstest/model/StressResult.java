package com.minialaddin.stresstest.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Result of applying a stress scenario to a portfolio.
 */
@Entity
@Table(name = "stress_results", indexes = @Index(name = "idx_stress_results_portfolio", columnList = "portfolio_id"))
public class StressResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "portfolio_id", nullable = false)
    private UUID portfolioId;

    @Column(name = "scenario_id", nullable = false)
    private UUID scenarioId;

    @Column(name = "scenario_name", length = 100)
    private String scenarioName;

    /** Portfolio value before the shock. */
    @Column(name = "original_value", precision = 18, scale = 4)
    private BigDecimal originalValue;

    /** Portfolio value after applying the shock. */
    @Column(name = "stressed_value", precision = 18, scale = 4)
    private BigDecimal stressedValue;

    /** Dollar impact of the shock. */
    @Column(name = "impact_amount", precision = 18, scale = 4)
    private BigDecimal impactAmount;

    /** Percentage impact of the shock. */
    @Column(name = "impact_pct", precision = 8, scale = 4)
    private BigDecimal impactPct;

    @Column(name = "calculated_at", nullable = false)
    private Instant calculatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.calculatedAt == null)
            this.calculatedAt = Instant.now();
    }

    // ── Constructors ──

    public StressResult() {
    }

    public StressResult(UUID portfolioId, UUID scenarioId, String scenarioName,
            BigDecimal originalValue, BigDecimal stressedValue,
            BigDecimal impactAmount, BigDecimal impactPct) {
        this.portfolioId = portfolioId;
        this.scenarioId = scenarioId;
        this.scenarioName = scenarioName;
        this.originalValue = originalValue;
        this.stressedValue = stressedValue;
        this.impactAmount = impactAmount;
        this.impactPct = impactPct;
    }

    // ── Getters & Setters ──

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPortfolioId() {
        return portfolioId;
    }

    public void setPortfolioId(UUID portfolioId) {
        this.portfolioId = portfolioId;
    }

    public UUID getScenarioId() {
        return scenarioId;
    }

    public void setScenarioId(UUID scenarioId) {
        this.scenarioId = scenarioId;
    }

    public String getScenarioName() {
        return scenarioName;
    }

    public void setScenarioName(String scenarioName) {
        this.scenarioName = scenarioName;
    }

    public BigDecimal getOriginalValue() {
        return originalValue;
    }

    public void setOriginalValue(BigDecimal originalValue) {
        this.originalValue = originalValue;
    }

    public BigDecimal getStressedValue() {
        return stressedValue;
    }

    public void setStressedValue(BigDecimal stressedValue) {
        this.stressedValue = stressedValue;
    }

    public BigDecimal getImpactAmount() {
        return impactAmount;
    }

    public void setImpactAmount(BigDecimal impactAmount) {
        this.impactAmount = impactAmount;
    }

    public BigDecimal getImpactPct() {
        return impactPct;
    }

    public void setImpactPct(BigDecimal impactPct) {
        this.impactPct = impactPct;
    }

    public Instant getCalculatedAt() {
        return calculatedAt;
    }
}

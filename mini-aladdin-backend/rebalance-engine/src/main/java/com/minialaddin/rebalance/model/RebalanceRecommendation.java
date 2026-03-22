package com.minialaddin.rebalance.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * A single rebalance recommendation — tells the user to BUY or SELL
 * a specific quantity of an asset to bring the portfolio back to target.
 */
@Entity
@Table(name = "rebalance_recommendations", indexes = @Index(name = "idx_rebal_portfolio", columnList = "portfolio_id"))
public class RebalanceRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "portfolio_id", nullable = false)
    private UUID portfolioId;

    @Column(nullable = false, length = 20)
    private String ticker;

    @Column(name = "asset_name", length = 255)
    private String assetName;

    /** BUY or SELL */
    @Column(nullable = false, length = 8)
    private String action;

    /** Suggested quantity to trade. */
    @Column(nullable = false, precision = 18, scale = 6)
    private BigDecimal quantity;

    /** Estimated trade value at current price. */
    @Column(name = "estimated_value", precision = 18, scale = 4)
    private BigDecimal estimatedValue;

    /** Human-readable reason for this recommendation. */
    @Column(columnDefinition = "TEXT")
    private String reason;

    /** Current allocation % of this asset type. */
    @Column(name = "current_pct", precision = 5, scale = 2)
    private BigDecimal currentPct;

    /** Target allocation %. */
    @Column(name = "target_pct", precision = 5, scale = 2)
    private BigDecimal targetPct;

    /** Drift = current - target. */
    @Column(name = "drift_pct", precision = 5, scale = 2)
    private BigDecimal driftPct;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null)
            this.createdAt = Instant.now();
    }

    // ── Constructors ──

    public RebalanceRecommendation() {
    }

    public RebalanceRecommendation(UUID portfolioId, String ticker, String assetName,
            String action, BigDecimal quantity, BigDecimal estimatedValue,
            String reason, BigDecimal currentPct, BigDecimal targetPct,
            BigDecimal driftPct) {
        this.portfolioId = portfolioId;
        this.ticker = ticker;
        this.assetName = assetName;
        this.action = action;
        this.quantity = quantity;
        this.estimatedValue = estimatedValue;
        this.reason = reason;
        this.currentPct = currentPct;
        this.targetPct = targetPct;
        this.driftPct = driftPct;
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

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getEstimatedValue() {
        return estimatedValue;
    }

    public void setEstimatedValue(BigDecimal estimatedValue) {
        this.estimatedValue = estimatedValue;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public BigDecimal getCurrentPct() {
        return currentPct;
    }

    public void setCurrentPct(BigDecimal currentPct) {
        this.currentPct = currentPct;
    }

    public BigDecimal getTargetPct() {
        return targetPct;
    }

    public void setTargetPct(BigDecimal targetPct) {
        this.targetPct = targetPct;
    }

    public BigDecimal getDriftPct() {
        return driftPct;
    }

    public void setDriftPct(BigDecimal driftPct) {
        this.driftPct = driftPct;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

package com.minialaddin.portfolio.model;

import com.minialaddin.common.dto.AssetType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * A target allocation rule for rebalancing.
 * e.g. "60% EQUITY, 40% DEBT"
 *
 * Maps to the "target_allocations" table.
 */
@Entity
@Table(
    name = "target_allocations",
    indexes = @Index(name = "idx_target_alloc_portfolio", columnList = "portfolio_id")
)
public class TargetAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    /**
     * The asset type this allocation target applies to.
     * e.g. EQUITY, DEBT, ETF
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false, length = 24)
    private AssetType assetType;

    /**
     * Target percentage (0.00 – 100.00).
     * e.g. 60.00 means 60% of portfolio value.
     */
    @Column(name = "target_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal targetPct;

    // ── Constructors ──

    public TargetAllocation() {}

    public TargetAllocation(Portfolio portfolio, AssetType assetType, BigDecimal targetPct) {
        this.portfolio = portfolio;
        this.assetType = assetType;
        this.targetPct = targetPct;
    }

    // ── Getters & Setters ──

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Portfolio getPortfolio() { return portfolio; }
    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }

    public AssetType getAssetType() { return assetType; }
    public void setAssetType(AssetType assetType) { this.assetType = assetType; }

    public BigDecimal getTargetPct() { return targetPct; }
    public void setTargetPct(BigDecimal targetPct) { this.targetPct = targetPct; }
}

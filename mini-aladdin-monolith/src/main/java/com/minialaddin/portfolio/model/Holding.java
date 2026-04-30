package com.minialaddin.portfolio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * A single position within a portfolio — tracks quantity and cost basis.
 *
 * The unique constraint (portfolio_id, asset_id) ensures one holding
 * per asset per portfolio. To add more of the same asset, update quantity.
 *
 * Maps to the "holdings" table.
 */
@Entity
@Table(
    name = "holdings",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_holdings_portfolio_asset",
        columnNames = {"portfolio_id", "asset_id"}
    ),
    indexes = @Index(name = "idx_holdings_portfolio", columnList = "portfolio_id")
)
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    /**
     * Number of units held.
     * Supports fractional shares (6 decimal places).
     */
    @Column(nullable = false, precision = 18, scale = 6)
    private BigDecimal quantity;

    /**
     * Volume-weighted average purchase price (4 decimal places).
     */
    @Column(name = "avg_buy_price", nullable = false, precision = 18, scale = 4)
    private BigDecimal avgBuyPrice;

    @Column(name = "added_at", nullable = false, updatable = false)
    private Instant addedAt;

    // ── Lifecycle ──

    @PrePersist
    protected void onCreate() {
        if (this.addedAt == null) this.addedAt = Instant.now();
    }

    // ── Constructors ──

    public Holding() {}

    public Holding(Portfolio portfolio, Asset asset, BigDecimal quantity, BigDecimal avgBuyPrice) {
        this.portfolio = portfolio;
        this.asset = asset;
        this.quantity = quantity;
        this.avgBuyPrice = avgBuyPrice;
    }

    // ── Derived values ──

    /** Total cost basis = quantity × avgBuyPrice */
    public BigDecimal getCostBasis() {
        return quantity.multiply(avgBuyPrice);
    }

    // ── Getters & Setters ──

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Portfolio getPortfolio() { return portfolio; }
    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }

    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getAvgBuyPrice() { return avgBuyPrice; }
    public void setAvgBuyPrice(BigDecimal avgBuyPrice) { this.avgBuyPrice = avgBuyPrice; }

    public Instant getAddedAt() { return addedAt; }
}

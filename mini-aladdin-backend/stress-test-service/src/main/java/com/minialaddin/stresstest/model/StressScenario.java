package com.minialaddin.stresstest.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Predefined stress test scenario — e.g., "2008 Financial Crisis", "COVID
 * Crash".
 * Each scenario defines shock percentages for different asset classes.
 */
@Entity
@Table(name = "stress_scenarios")
public class StressScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Equity market shock in % (e.g., -38.0 for 38% drop). */
    @Column(name = "equity_shock_pct", precision = 6, scale = 2)
    private BigDecimal equityShockPct;

    /** Bond shock in %. */
    @Column(name = "bond_shock_pct", precision = 6, scale = 2)
    private BigDecimal bondShockPct;

    /** FX shock in %. */
    @Column(name = "fx_shock_pct", precision = 6, scale = 2)
    private BigDecimal fxShockPct;

    /** Interest rate shock in basis points (e.g., 200 = +2%). */
    @Column(name = "rate_shock_bps", precision = 6, scale = 0)
    private BigDecimal rateShockBps;

    /** Commodity shock in %. */
    @Column(name = "commodity_shock_pct", precision = 6, scale = 2)
    private BigDecimal commodityShockPct;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null)
            this.createdAt = Instant.now();
    }

    // ── Constructors ──

    public StressScenario() {
    }

    public StressScenario(String name, String description,
            BigDecimal equityShockPct, BigDecimal bondShockPct,
            BigDecimal fxShockPct, BigDecimal rateShockBps,
            BigDecimal commodityShockPct) {
        this.name = name;
        this.description = description;
        this.equityShockPct = equityShockPct;
        this.bondShockPct = bondShockPct;
        this.fxShockPct = fxShockPct;
        this.rateShockBps = rateShockBps;
        this.commodityShockPct = commodityShockPct;
    }

    // ── Getters & Setters ──

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getEquityShockPct() {
        return equityShockPct;
    }

    public void setEquityShockPct(BigDecimal equityShockPct) {
        this.equityShockPct = equityShockPct;
    }

    public BigDecimal getBondShockPct() {
        return bondShockPct;
    }

    public void setBondShockPct(BigDecimal bondShockPct) {
        this.bondShockPct = bondShockPct;
    }

    public BigDecimal getFxShockPct() {
        return fxShockPct;
    }

    public void setFxShockPct(BigDecimal fxShockPct) {
        this.fxShockPct = fxShockPct;
    }

    public BigDecimal getRateShockBps() {
        return rateShockBps;
    }

    public void setRateShockBps(BigDecimal rateShockBps) {
        this.rateShockBps = rateShockBps;
    }

    public BigDecimal getCommodityShockPct() {
        return commodityShockPct;
    }

    public void setCommodityShockPct(BigDecimal commodityShockPct) {
        this.commodityShockPct = commodityShockPct;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

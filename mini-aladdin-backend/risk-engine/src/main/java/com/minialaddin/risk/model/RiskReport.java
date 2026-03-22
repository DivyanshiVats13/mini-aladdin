package com.minialaddin.risk.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Stores a computed risk report snapshot for a portfolio.
 */
@Entity
@Table(name = "risk_reports", indexes = @Index(name = "idx_risk_reports_portfolio", columnList = "portfolio_id"))
public class RiskReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "portfolio_id", nullable = false)
    private UUID portfolioId;

    /** Portfolio Beta relative to benchmark (SPY). */
    @Column(precision = 8, scale = 4)
    private BigDecimal beta;

    /** Annualized volatility (standard deviation of returns). */
    @Column(precision = 8, scale = 4)
    private BigDecimal volatility;

    /** Sharpe Ratio = (return - riskFreeRate) / volatility. */
    @Column(name = "sharpe_ratio", precision = 8, scale = 4)
    private BigDecimal sharpeRatio;

    /** Daily Value-at-Risk at 95% confidence level. */
    @Column(name = "var_daily_95", precision = 18, scale = 4)
    private BigDecimal varDaily95;

    /** Total portfolio value at time of calculation. */
    @Column(name = "portfolio_value", precision = 18, scale = 4)
    private BigDecimal portfolioValue;

    @Column(name = "calculated_at", nullable = false)
    private Instant calculatedAt;

    // ── Lifecycle ──

    @PrePersist
    protected void onCreate() {
        if (this.calculatedAt == null)
            this.calculatedAt = Instant.now();
    }

    // ── Constructors ──

    public RiskReport() {
    }

    public RiskReport(UUID portfolioId, BigDecimal beta, BigDecimal volatility,
            BigDecimal sharpeRatio, BigDecimal varDaily95, BigDecimal portfolioValue) {
        this.portfolioId = portfolioId;
        this.beta = beta;
        this.volatility = volatility;
        this.sharpeRatio = sharpeRatio;
        this.varDaily95 = varDaily95;
        this.portfolioValue = portfolioValue;
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

    public BigDecimal getBeta() {
        return beta;
    }

    public void setBeta(BigDecimal beta) {
        this.beta = beta;
    }

    public BigDecimal getVolatility() {
        return volatility;
    }

    public void setVolatility(BigDecimal volatility) {
        this.volatility = volatility;
    }

    public BigDecimal getSharpeRatio() {
        return sharpeRatio;
    }

    public void setSharpeRatio(BigDecimal sharpeRatio) {
        this.sharpeRatio = sharpeRatio;
    }

    public BigDecimal getVarDaily95() {
        return varDaily95;
    }

    public void setVarDaily95(BigDecimal varDaily95) {
        this.varDaily95 = varDaily95;
    }

    public BigDecimal getPortfolioValue() {
        return portfolioValue;
    }

    public void setPortfolioValue(BigDecimal portfolioValue) {
        this.portfolioValue = portfolioValue;
    }

    public Instant getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(Instant calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}

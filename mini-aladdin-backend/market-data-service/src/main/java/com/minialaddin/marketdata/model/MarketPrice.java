package com.minialaddin.marketdata.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Stores a fetched market price snapshot for an asset.
 * Each row represents a single price tick from an external API.
 */
@Entity
@Table(name = "market_prices", indexes = {
        @Index(name = "idx_market_prices_ticker", columnList = "ticker"),
        @Index(name = "idx_market_prices_fetched", columnList = "fetched_at")
})
public class MarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 20)
    private String ticker;

    @Column(nullable = false, length = 16)
    private String exchange;

    /** Latest traded price. */
    @Column(nullable = false, precision = 18, scale = 4)
    private BigDecimal price;

    /** Previous trading day's close. */
    @Column(name = "previous_close", precision = 18, scale = 4)
    private BigDecimal previousClose;

    /** Change from previous close. */
    @Column(name = "change_amount", precision = 18, scale = 4)
    private BigDecimal changeAmount;

    /** Percentage change from previous close. */
    @Column(name = "change_pct", precision = 8, scale = 4)
    private BigDecimal changePct;

    /** Trading volume. */
    private Long volume;

    @Column(name = "fetched_at", nullable = false)
    private Instant fetchedAt;

    // ── Lifecycle ──

    @PrePersist
    protected void onCreate() {
        if (this.fetchedAt == null)
            this.fetchedAt = Instant.now();
    }

    // ── Constructors ──

    public MarketPrice() {
    }

    public MarketPrice(String ticker, String exchange, BigDecimal price,
            BigDecimal previousClose, BigDecimal changeAmount,
            BigDecimal changePct, Long volume) {
        this.ticker = ticker;
        this.exchange = exchange;
        this.price = price;
        this.previousClose = previousClose;
        this.changeAmount = changeAmount;
        this.changePct = changePct;
        this.volume = volume;
    }

    // ── Getters & Setters ──

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getPreviousClose() {
        return previousClose;
    }

    public void setPreviousClose(BigDecimal previousClose) {
        this.previousClose = previousClose;
    }

    public BigDecimal getChangeAmount() {
        return changeAmount;
    }

    public void setChangeAmount(BigDecimal changeAmount) {
        this.changeAmount = changeAmount;
    }

    public BigDecimal getChangePct() {
        return changePct;
    }

    public void setChangePct(BigDecimal changePct) {
        this.changePct = changePct;
    }

    public Long getVolume() {
        return volume;
    }

    public void setVolume(Long volume) {
        this.volume = volume;
    }

    public Instant getFetchedAt() {
        return fetchedAt;
    }

    public void setFetchedAt(Instant fetchedAt) {
        this.fetchedAt = fetchedAt;
    }
}

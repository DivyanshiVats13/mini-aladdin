package com.minialaddin.portfolio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * A user's portfolio — a named collection of holdings.
 * Users can have multiple portfolios (e.g. "Retirement", "Trading").
 *
 * Maps to the "portfolios" table.
 */
@Entity
@Table(
    name = "portfolios",
    indexes = @Index(name = "idx_portfolios_user", columnList = "user_id")
)
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * References the User from auth-service.
     * Stored as a raw UUID (no JPA cross-service relationship).
     */
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 128)
    private String name = "My Portfolio";

    /** Reporting currency — USD or INR. */
    @Column(nullable = false, length = 4)
    private String currency = "USD";

    @JsonIgnore
    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Holding> holdings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TargetAllocation> targetAllocations = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // ── Lifecycle ──

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // ── Constructors ──

    public Portfolio() {}

    public Portfolio(UUID userId, String name, String currency) {
        this.userId = userId;
        this.name = name;
        this.currency = currency;
    }

    // ── Helper methods ──

    public void addHolding(Holding holding) {
        holdings.add(holding);
        holding.setPortfolio(this);
    }

    public void removeHolding(Holding holding) {
        holdings.remove(holding);
        holding.setPortfolio(null);
    }

    public void addTargetAllocation(TargetAllocation allocation) {
        targetAllocations.add(allocation);
        allocation.setPortfolio(this);
    }

    // ── Getters & Setters ──

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public List<Holding> getHoldings() { return holdings; }
    public void setHoldings(List<Holding> holdings) { this.holdings = holdings; }

    public List<TargetAllocation> getTargetAllocations() { return targetAllocations; }
    public void setTargetAllocations(List<TargetAllocation> targetAllocations) {
        this.targetAllocations = targetAllocations;
    }

    public Instant getCreatedAt() { return createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
}

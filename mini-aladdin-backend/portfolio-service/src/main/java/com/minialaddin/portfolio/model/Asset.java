package com.minialaddin.portfolio.model;

import com.minialaddin.common.dto.AssetType;
import com.minialaddin.common.dto.Exchange;
import jakarta.persistence.*;
import java.util.UUID;

/**
 * Master security catalogue — represents a single tradeable instrument.
 *
 * <h3>Dual-identifier design</h3>
 * <ul>
 *   <li><b>Global markets (NYSE/NASDAQ):</b> identified by {@code ticker} (e.g. "AAPL", "MSFT")</li>
 *   <li><b>Indian markets (NSE/BSE):</b> identified by both {@code ticker} (trading symbol,
 *       e.g. "RELIANCE") <i>and</i> {@code isin} (International Securities Identification
 *       Number, e.g. "INE002A01018"). ISIN is the canonical cross-exchange identifier.</li>
 * </ul>
 *
 * The unique constraint is on (ticker, exchange) so the same symbol can exist on
 * different exchanges (e.g. "RELIANCE" on NSE vs BSE). ISIN provides an additional
 * lookup path for Indian instruments.
 *
 * Maps to the "assets" table.
 */
@Entity
@Table(
    name = "assets",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_assets_ticker_exchange",
        columnNames = {"ticker", "exchange"}
    )
)
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Trading symbol / ticker.
     * Global: "AAPL", "MSFT", "GOOGL"
     * Indian: "RELIANCE", "TCS", "INFY"
     */
    @Column(nullable = false, length = 20)
    private String ticker;

    /**
     * Human-readable security name.
     * e.g. "Apple Inc.", "Reliance Industries Ltd."
     */
    @Column(nullable = false, length = 255)
    private String name;

    /**
     * ISIN — International Securities Identification Number.
     * 12-character alphanumeric code (e.g. "INE002A01018" for Reliance on NSE/BSE).
     * Nullable for global instruments where ticker is sufficient.
     * Unique when present.
     */
    @Column(length = 12, unique = true)
    private String isin;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false, length = 24)
    private AssetType assetType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Exchange exchange;

    /**
     * GICS / custom sector label for concentration analysis.
     * e.g. "Technology", "Energy", "Financial Services"
     */
    @Column(length = 64)
    private String sector;

    /**
     * Reporting currency for this instrument.
     * "USD" for NYSE/NASDAQ, "INR" for NSE/BSE.
     */
    @Column(nullable = false, length = 4)
    private String currency = "USD";

    // ── Constructors ──

    public Asset() {}

    /**
     * Convenience constructor for Global instruments.
     */
    public Asset(String ticker, String name, AssetType assetType,
                 Exchange exchange, String sector, String currency) {
        this.ticker = ticker;
        this.name = name;
        this.assetType = assetType;
        this.exchange = exchange;
        this.sector = sector;
        this.currency = currency;
    }

    /**
     * Convenience constructor for Indian instruments (includes ISIN).
     */
    public Asset(String ticker, String name, String isin, AssetType assetType,
                 Exchange exchange, String sector, String currency) {
        this(ticker, name, assetType, exchange, sector, currency);
        this.isin = isin;
    }

    // ── Helper methods ──

    /** Returns true if this asset belongs to an Indian exchange (NSE or BSE). */
    public boolean isIndianMarket() {
        return exchange == Exchange.NSE || exchange == Exchange.BSE;
    }

    /** Returns true if this asset belongs to a US exchange (NYSE or NASDAQ). */
    public boolean isGlobalMarket() {
        return exchange == Exchange.NYSE || exchange == Exchange.NASDAQ;
    }

    /**
     * Returns the best available identifier for API lookups:
     * - ISIN for Indian instruments (if present)
     * - Ticker for everything else
     */
    public String getPrimaryIdentifier() {
        if (isIndianMarket() && isin != null && !isin.isBlank()) {
            return isin;
        }
        return ticker;
    }

    // ── Getters & Setters ──

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIsin() { return isin; }
    public void setIsin(String isin) { this.isin = isin; }

    public AssetType getAssetType() { return assetType; }
    public void setAssetType(AssetType assetType) { this.assetType = assetType; }

    public Exchange getExchange() { return exchange; }
    public void setExchange(Exchange exchange) { this.exchange = exchange; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    @Override
    public String toString() {
        return "Asset{" + ticker + " (" + exchange + ")"
                + (isin != null ? " ISIN=" + isin : "") + "}";
    }
}

package com.minialaddin.portfolio.service;

import com.minialaddin.common.dto.AssetType;
import com.minialaddin.common.dto.Exchange;
import com.minialaddin.common.exception.ResourceNotFoundException;
import com.minialaddin.portfolio.model.Asset;
import com.minialaddin.portfolio.repository.AssetRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Asset catalogue service — CRUD + seed data for common stocks.
 */
@Service
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    /**
     * List all assets, optionally filtered by search query.
     */
    public List<Asset> listAssets(String search) {
        if (search != null && !search.isBlank()) {
            return assetRepository.findByTickerContainingIgnoreCaseOrNameContainingIgnoreCase(
                    search, search);
        }
        return assetRepository.findAll();
    }

    /**
     * Get a single asset by ID.
     */
    public Asset getAsset(UUID id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + id));
    }

    /**
     * Seed the asset catalogue with common US and Indian stocks
     * if the catalogue is empty (first startup).
     */
    @PostConstruct
    public void seedAssets() {
        if (assetRepository.count() > 0) {
            return; // Already seeded
        }

        List<Asset> seeds = List.of(
                // ── US Stocks (NYSE / NASDAQ) ──
                new Asset("AAPL", "Apple Inc.", AssetType.EQUITY, Exchange.NASDAQ, "Technology", "USD"),
                new Asset("MSFT", "Microsoft Corp.", AssetType.EQUITY, Exchange.NASDAQ, "Technology", "USD"),
                new Asset("GOOGL", "Alphabet Inc.", AssetType.EQUITY, Exchange.NASDAQ, "Technology", "USD"),
                new Asset("AMZN", "Amazon.com Inc.", AssetType.EQUITY, Exchange.NASDAQ, "Consumer Discretionary",
                        "USD"),
                new Asset("TSLA", "Tesla Inc.", AssetType.EQUITY, Exchange.NASDAQ, "Consumer Discretionary", "USD"),
                new Asset("NVDA", "NVIDIA Corp.", AssetType.EQUITY, Exchange.NASDAQ, "Technology", "USD"),
                new Asset("META", "Meta Platforms Inc.", AssetType.EQUITY, Exchange.NASDAQ, "Technology", "USD"),
                new Asset("JPM", "JPMorgan Chase & Co.", AssetType.EQUITY, Exchange.NYSE, "Financial Services", "USD"),
                new Asset("JNJ", "Johnson & Johnson", AssetType.EQUITY, Exchange.NYSE, "Healthcare", "USD"),
                new Asset("V", "Visa Inc.", AssetType.EQUITY, Exchange.NYSE, "Financial Services", "USD"),
                new Asset("SPY", "SPDR S&P 500 ETF Trust", AssetType.ETF, Exchange.NYSE, "Index Fund", "USD"),
                new Asset("QQQ", "Invesco QQQ Trust", AssetType.ETF, Exchange.NASDAQ, "Index Fund", "USD"),

                // ── Indian Stocks (NSE) ──
                new Asset("RELIANCE", "Reliance Industries Ltd.", "INE002A01018", AssetType.EQUITY, Exchange.NSE,
                        "Energy", "INR"),
                new Asset("TCS", "Tata Consultancy Services", "INE467B01029", AssetType.EQUITY, Exchange.NSE,
                        "Technology", "INR"),
                new Asset("INFY", "Infosys Ltd.", "INE009A01021", AssetType.EQUITY, Exchange.NSE, "Technology", "INR"),
                new Asset("HDFCBANK", "HDFC Bank Ltd.", "INE040A01034", AssetType.EQUITY, Exchange.NSE,
                        "Financial Services", "INR"),
                new Asset("ICICIBANK", "ICICI Bank Ltd.", "INE090A01021", AssetType.EQUITY, Exchange.NSE,
                        "Financial Services", "INR"),
                new Asset("HINDUNILVR", "Hindustan Unilever Ltd.", "INE030A01027", AssetType.EQUITY, Exchange.NSE,
                        "Consumer Staples", "INR"),
                new Asset("BHARTIARTL", "Bharti Airtel Ltd.", "INE397D01024", AssetType.EQUITY, Exchange.NSE,
                        "Communication", "INR"),
                new Asset("ITC", "ITC Ltd.", "INE154A01025", AssetType.EQUITY, Exchange.NSE, "Consumer Staples",
                        "INR"));

        assetRepository.saveAll(seeds);
    }
}

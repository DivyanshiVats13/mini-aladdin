package com.minialaddin.marketdata.adapter;

import com.minialaddin.marketdata.model.MarketPrice;

/**
 * Adapter interface for fetching market prices from external APIs.
 * Implementations: AlphaVantageAdapter (and future: Yahoo, TrueData).
 */
public interface MarketDataAdapter {

    /**
     * Fetch the latest price for a given ticker symbol.
     *
     * @param ticker   Trading symbol (e.g. "AAPL", "RELIANCE")
     * @param exchange Exchange name (e.g. "NASDAQ", "NSE")
     * @return MarketPrice with latest data, or null if unavailable
     */
    MarketPrice fetchPrice(String ticker, String exchange);

    /**
     * Returns the name of this adapter (for logging/debugging).
     */
    String getAdapterName();
}

package com.minialaddin.market.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.minialaddin.market.dto.QuoteResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Fetches real-time stock prices from Yahoo Finance (free, no API key).
 * Caches results in-memory with a 5-minute TTL to avoid rate limits.
 */
@Service
public class MarketDataService {

    private static final Logger log = LoggerFactory.getLogger(MarketDataService.class);
    private static final String YAHOO_CHART_URL =
            "https://query1.finance.yahoo.com/v8/finance/chart/%s?interval=1d&range=%s";
    private static final Duration CACHE_TTL = Duration.ofMinutes(5);

    private final RestTemplate restTemplate;
    private final Map<String, CachedQuote> quoteCache = new ConcurrentHashMap<>();
    private final Map<String, CachedHistory> historyCache = new ConcurrentHashMap<>();

    public MarketDataService() {
        this.restTemplate = new RestTemplate();
    }

    // ── Public API ──────────────────────────────────────────────

    /**
     * Get the current price quote for a ticker. Returns null if unavailable.
     */
    public QuoteResponse getQuote(String ticker) {
        String key = ticker.toUpperCase();

        CachedQuote cached = quoteCache.get(key);
        if (cached != null && !cached.isExpired()) {
            return cached.quote;
        }

        try {
            String url = String.format(YAHOO_CHART_URL, key, "2d");
            JsonNode root = fetchYahoo(url);
            if (root == null) return null;

            JsonNode meta = root.at("/chart/result/0/meta");
            BigDecimal price = decimal(meta, "regularMarketPrice");
            BigDecimal prevClose = decimal(meta, "previousClose");
            String currency = text(meta, "currency", "USD");

            if (price == null) return null;

            BigDecimal change = prevClose != null
                    ? price.subtract(prevClose).setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            BigDecimal changePct = prevClose != null && prevClose.compareTo(BigDecimal.ZERO) > 0
                    ? change.divide(prevClose, 6, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            .setScale(2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            QuoteResponse quote = new QuoteResponse(key, price, prevClose, change, changePct, currency);
            quoteCache.put(key, new CachedQuote(quote, Instant.now()));
            return quote;

        } catch (Exception e) {
            log.warn("Failed to fetch quote for {}: {}", key, e.getMessage());
            return null;
        }
    }

    /**
     * Get current price for a ticker. Falls back to the provided default if unavailable.
     */
    public BigDecimal getPrice(String ticker, BigDecimal fallback) {
        QuoteResponse quote = getQuote(ticker);
        return quote != null ? quote.price() : fallback;
    }

    /**
     * Get historical adjusted close prices (most recent first).
     * Used by the risk engine for volatility/beta calculations.
     *
     * @param ticker Trading symbol
     * @param range  Yahoo range string: "1mo", "3mo", "6mo", "1y"
     * @return list of daily adjusted close prices, or empty list
     */
    public List<BigDecimal> getHistoricalPrices(String ticker, String range) {
        String key = ticker.toUpperCase() + ":" + range;

        CachedHistory cached = historyCache.get(key);
        if (cached != null && !cached.isExpired()) {
            return cached.prices;
        }

        try {
            String url = String.format(YAHOO_CHART_URL, ticker.toUpperCase(), range);
            JsonNode root = fetchYahoo(url);
            if (root == null) return List.of();

            // Try adjclose first, fall back to close
            JsonNode adjCloseNode = root.at("/chart/result/0/indicators/adjclose/0/adjclose");
            if (adjCloseNode.isMissingNode() || !adjCloseNode.isArray()) {
                adjCloseNode = root.at("/chart/result/0/indicators/quote/0/close");
            }
            if (adjCloseNode.isMissingNode() || !adjCloseNode.isArray()) {
                return List.of();
            }

            List<BigDecimal> prices = new ArrayList<>();
            for (JsonNode node : adjCloseNode) {
                if (!node.isNull()) {
                    prices.add(BigDecimal.valueOf(node.doubleValue()));
                }
            }

            historyCache.put(key, new CachedHistory(prices, Instant.now()));
            return prices;

        } catch (Exception e) {
            log.warn("Failed to fetch history for {}: {}", ticker, e.getMessage());
            return List.of();
        }
    }

    // ── Internal ────────────────────────────────────────────────

    private JsonNode fetchYahoo(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<JsonNode> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, JsonNode.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        }
        return null;
    }

    private BigDecimal decimal(JsonNode node, String field) {
        JsonNode child = node.get(field);
        if (child == null || child.isNull()) return null;
        return BigDecimal.valueOf(child.doubleValue());
    }

    private String text(JsonNode node, String field, String defaultValue) {
        JsonNode child = node.get(field);
        if (child == null || child.isNull()) return defaultValue;
        return child.asText(defaultValue);
    }

    // ── Cache entries ──────────────────────────────────────────

    private record CachedQuote(QuoteResponse quote, Instant cachedAt) {
        boolean isExpired() { return Instant.now().isAfter(cachedAt.plus(CACHE_TTL)); }
    }

    private record CachedHistory(List<BigDecimal> prices, Instant cachedAt) {
        boolean isExpired() { return Instant.now().isAfter(cachedAt.plus(CACHE_TTL)); }
    }
}

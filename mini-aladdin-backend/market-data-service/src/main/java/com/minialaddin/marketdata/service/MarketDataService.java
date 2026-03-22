package com.minialaddin.marketdata.service;

import com.minialaddin.marketdata.adapter.MarketDataAdapter;
import com.minialaddin.marketdata.cache.PriceCache;
import com.minialaddin.marketdata.model.MarketPrice;
import com.minialaddin.marketdata.repository.MarketPriceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Market data orchestrator:
 * 1. Check Redis cache
 * 2. If miss → call external API via adapter
 * 3. Store in Redis cache
 * 4. Persist to DB (price history)
 * 5. Publish to Kafka for real-time consumers
 */
@Service
public class MarketDataService {

    private static final Logger log = LoggerFactory.getLogger(MarketDataService.class);

    private final MarketDataAdapter marketDataAdapter;
    private final PriceCache priceCache;
    private final MarketPriceRepository priceRepository;
    private final KafkaPriceProducer kafkaProducer;

    public MarketDataService(MarketDataAdapter marketDataAdapter,
            PriceCache priceCache,
            MarketPriceRepository priceRepository,
            KafkaPriceProducer kafkaProducer) {
        this.marketDataAdapter = marketDataAdapter;
        this.priceCache = priceCache;
        this.priceRepository = priceRepository;
        this.kafkaProducer = kafkaProducer;
    }

    /**
     * Get the latest price for a ticker.
     * Flow: Redis → API → Redis + DB + Kafka
     */
    public MarketPrice getPrice(String ticker, String exchange) {
        // 1. Check cache
        MarketPrice cached = priceCache.get(ticker);
        if (cached != null) {
            return cached;
        }

        // 2. Fetch from external API
        MarketPrice fresh = marketDataAdapter.fetchPrice(ticker, exchange);
        if (fresh == null) {
            // Fallback: return latest from DB
            log.info("API returned null for {}, checking DB fallback", ticker);
            return priceRepository.findTopByTickerOrderByFetchedAtDesc(ticker).orElse(null);
        }

        // 3. Cache in Redis
        priceCache.put(ticker, fresh);

        // 4. Persist to DB
        priceRepository.save(fresh);

        // 5. Publish to Kafka
        kafkaProducer.publishPriceTick(fresh);

        log.info("Fetched and cached price for {} via {}: {}",
                ticker, marketDataAdapter.getAdapterName(), fresh.getPrice());
        return fresh;
    }

    /**
     * Get prices for multiple tickers.
     */
    public List<MarketPrice> getBatchPrices(List<String> tickers, String exchange) {
        List<MarketPrice> results = new ArrayList<>();
        for (String ticker : tickers) {
            MarketPrice price = getPrice(ticker, exchange);
            if (price != null) {
                results.add(price);
            }
        }
        return results;
    }
}

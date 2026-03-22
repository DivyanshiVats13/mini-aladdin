package com.minialaddin.marketdata.cache;

import com.minialaddin.marketdata.model.MarketPrice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Redis-backed price cache with 5-minute TTL.
 * Key format: "price:{ticker}" → serialized MarketPrice JSON.
 */
@Component
public class PriceCache {

    private static final Logger log = LoggerFactory.getLogger(PriceCache.class);
    private static final String KEY_PREFIX = "price:";
    private static final Duration TTL = Duration.ofMinutes(5);

    private final RedisTemplate<String, Object> redisTemplate;

    public PriceCache(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Get cached price for a ticker, or null if expired/missing.
     */
    public MarketPrice get(String ticker) {
        try {
            Object cached = redisTemplate.opsForValue().get(KEY_PREFIX + ticker);
            if (cached instanceof MarketPrice mp) {
                log.debug("Cache HIT for {}", ticker);
                return mp;
            }
        } catch (Exception e) {
            log.warn("Redis read error for {}: {}", ticker, e.getMessage());
        }
        return null;
    }

    /**
     * Store a price in Redis with 5-minute TTL.
     */
    public void put(String ticker, MarketPrice price) {
        try {
            redisTemplate.opsForValue().set(KEY_PREFIX + ticker, price, TTL);
            log.debug("Cached price for {} (TTL: {})", ticker, TTL);
        } catch (Exception e) {
            log.warn("Redis write error for {}: {}", ticker, e.getMessage());
        }
    }

    /**
     * Evict a cached price.
     */
    public void evict(String ticker) {
        redisTemplate.delete(KEY_PREFIX + ticker);
    }
}

package com.minialaddin.marketdata.repository;

import com.minialaddin.marketdata.model.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPrice, UUID> {

    /** Find the most recent price for a given ticker. */
    Optional<MarketPrice> findTopByTickerOrderByFetchedAtDesc(String ticker);

    /** Find the most recent price for a ticker on a specific exchange. */
    Optional<MarketPrice> findTopByTickerAndExchangeOrderByFetchedAtDesc(
            String ticker, String exchange);
}

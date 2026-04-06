package com.minialaddin.portfolio.repository;

import com.minialaddin.common.dto.Exchange;
import com.minialaddin.portfolio.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetRepository extends JpaRepository<Asset, UUID> {

    /** Find by trading ticker and exchange (the primary unique constraint). */
    Optional<Asset> findByTickerAndExchange(String ticker, Exchange exchange);

    /** Find by ISIN (Indian instruments cross-exchange lookup). */
    Optional<Asset> findByIsin(String isin);

    /** List all assets on a given exchange. */
    List<Asset> findByExchange(Exchange exchange);

    /** Search by ticker or name (case-insensitive partial match). */
    List<Asset> findByTickerContainingIgnoreCaseOrNameContainingIgnoreCase(
            String ticker, String name);
}

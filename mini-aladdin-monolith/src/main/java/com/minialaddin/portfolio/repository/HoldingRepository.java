package com.minialaddin.portfolio.repository;

import com.minialaddin.portfolio.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, UUID> {

    /** All holdings in a portfolio. */
    List<Holding> findByPortfolioId(UUID portfolioId);

    /** Find specific holding by portfolio and asset. */
    Optional<Holding> findByPortfolioIdAndAssetId(UUID portfolioId, UUID assetId);
}

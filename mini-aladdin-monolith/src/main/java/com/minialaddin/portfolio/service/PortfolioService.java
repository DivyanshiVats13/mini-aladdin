package com.minialaddin.portfolio.service;

import com.minialaddin.common.exception.ResourceNotFoundException;
import com.minialaddin.common.exception.BadRequestException;
import com.minialaddin.common.util.FinanceUtils;
import com.minialaddin.market.service.MarketDataService;
import com.minialaddin.portfolio.dto.AddHoldingRequest;
import com.minialaddin.portfolio.dto.CreatePortfolioRequest;
import com.minialaddin.portfolio.dto.PortfolioSummaryResponse;
import com.minialaddin.portfolio.dto.PortfolioSummaryResponse.HoldingSummary;
import com.minialaddin.portfolio.model.Asset;
import com.minialaddin.portfolio.model.Holding;
import com.minialaddin.portfolio.model.Portfolio;
import com.minialaddin.portfolio.repository.AssetRepository;
import com.minialaddin.portfolio.repository.HoldingRepository;
import com.minialaddin.portfolio.repository.PortfolioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Portfolio & holdings CRUD with P&L calculation.
 */
@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final AssetRepository assetRepository;
    private final MarketDataService marketDataService;

    public PortfolioService(PortfolioRepository portfolioRepository,
            HoldingRepository holdingRepository,
            AssetRepository assetRepository,
            MarketDataService marketDataService) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.assetRepository = assetRepository;
        this.marketDataService = marketDataService;
    }

    /**
     * Create a new portfolio for a user.
     */
    @Transactional
    public Portfolio createPortfolio(UUID userId, CreatePortfolioRequest request) {
        Portfolio portfolio = new Portfolio(userId, request.name(), request.currency());
        return portfolioRepository.save(portfolio);
    }

    /**
     * List all portfolios for a user (raw entities).
     */
    public List<Portfolio> listPortfolios(UUID userId) {
        return portfolioRepository.findByUserId(userId);
    }

    /**
     * List all portfolios for a user with computed summary data
     * (totalValue, P&L, holdings count, etc.).
     */
    public List<PortfolioSummaryResponse> listPortfolioSummaries(UUID userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);
        List<PortfolioSummaryResponse> summaries = new ArrayList<>();
        for (Portfolio portfolio : portfolios) {
            summaries.add(getPortfolioSummary(portfolio.getId()));
        }
        return summaries;
    }

    /**
     * Get a portfolio by ID with full summary including P&L.
     * Uses avgBuyPrice as a stand-in for currentPrice until market-data-service is
     * live.
     */
    public PortfolioSummaryResponse getPortfolioSummary(UUID portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Portfolio not found: " + portfolioId));

        List<HoldingSummary> holdingSummaries = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;

        for (Holding holding : portfolio.getHoldings()) {
            Asset asset = holding.getAsset();

            // Use real market price; fall back to avgBuyPrice if unavailable
            BigDecimal currentPrice = marketDataService.getPrice(
                    asset.getTicker(), holding.getAvgBuyPrice());
            BigDecimal marketValue = holding.getQuantity().multiply(currentPrice);
            BigDecimal costBasis = holding.getCostBasis();
            BigDecimal pnL = marketValue.subtract(costBasis);
            BigDecimal pnLPct = FinanceUtils.pctChange(costBasis, marketValue);

            holdingSummaries.add(new HoldingSummary(
                    holding.getId(),
                    asset.getId(),
                    asset.getTicker(),
                    asset.getName(),
                    asset.getSector(),
                    holding.getQuantity(),
                    holding.getAvgBuyPrice(),
                    currentPrice,
                    FinanceUtils.roundCurrency(marketValue),
                    FinanceUtils.roundCurrency(costBasis),
                    FinanceUtils.roundCurrency(pnL),
                    pnLPct.setScale(2, RoundingMode.HALF_UP),
                    BigDecimal.ZERO // weight calculated below
            ));

            totalValue = totalValue.add(marketValue);
            totalCost = totalCost.add(costBasis);
        }

        // Calculate weight % for each holding
        BigDecimal finalTotalValue = totalValue;
        List<HoldingSummary> withWeights = holdingSummaries.stream()
                .map(h -> new HoldingSummary(
                        h.holdingId(), h.assetId(), h.ticker(), h.assetName(), h.sector(),
                        h.quantity(), h.avgBuyPrice(), h.currentPrice(),
                        h.marketValue(), h.costBasis(), h.pnL(), h.pnLPct(),
                        finalTotalValue.compareTo(BigDecimal.ZERO) > 0
                                ? h.marketValue().divide(finalTotalValue, 4, RoundingMode.HALF_UP)
                                        .multiply(BigDecimal.valueOf(100))
                                        .setScale(2, RoundingMode.HALF_UP)
                                : BigDecimal.ZERO))
                .toList();

        BigDecimal totalPnL = totalValue.subtract(totalCost);
        BigDecimal totalPnLPct = FinanceUtils.pctChange(totalCost, totalValue);

        return new PortfolioSummaryResponse(
                portfolio.getId(),
                portfolio.getName(),
                portfolio.getCurrency(),
                FinanceUtils.roundCurrency(totalValue),
                FinanceUtils.roundCurrency(totalCost),
                FinanceUtils.roundCurrency(totalPnL),
                totalPnLPct.setScale(2, RoundingMode.HALF_UP),
                withWeights,
                portfolio.getCreatedAt(),
                portfolio.getUpdatedAt());
    }

    /**
     * Add a holding to a portfolio.
     */
    @Transactional
    public Holding addHolding(UUID portfolioId, AddHoldingRequest request) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Portfolio not found: " + portfolioId));

        Asset asset = assetRepository.findById(request.assetId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Asset not found: " + request.assetId()));

        // Check if holding already exists for this asset
        if (holdingRepository.findByPortfolioIdAndAssetId(portfolioId, request.assetId()).isPresent()) {
            throw new BadRequestException(
                    "Holding already exists for asset " + asset.getTicker()
                            + ". Update the existing holding instead.");
        }

        Holding holding = new Holding(portfolio, asset, request.quantity(), request.avgBuyPrice());
        return holdingRepository.save(holding);
    }

    /**
     * Remove a holding from a portfolio.
     */
    @Transactional
    public void removeHolding(UUID portfolioId, UUID holdingId) {
        Holding holding = holdingRepository.findById(holdingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Holding not found: " + holdingId));

        if (!holding.getPortfolio().getId().equals(portfolioId)) {
            throw new BadRequestException("Holding does not belong to this portfolio");
        }

        holdingRepository.delete(holding);
    }

    /**
     * Delete a portfolio and all its holdings.
     */
    @Transactional
    public void deletePortfolio(UUID portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Portfolio not found: " + portfolioId));
        portfolioRepository.delete(portfolio);
    }
}

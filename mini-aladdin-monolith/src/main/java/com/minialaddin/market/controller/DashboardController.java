package com.minialaddin.market.controller;

import com.minialaddin.auth.service.JwtService;
import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.market.dto.DashboardSummary;
import com.minialaddin.market.dto.DashboardSummary.TopHolding;
import com.minialaddin.market.service.MarketDataService;
import com.minialaddin.common.util.FinanceUtils;
import com.minialaddin.portfolio.model.Asset;
import com.minialaddin.portfolio.model.Holding;
import com.minialaddin.portfolio.model.Portfolio;
import com.minialaddin.portfolio.repository.PortfolioRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Dashboard summary endpoint — aggregates value, P&L, and top holdings
 * across all of a user's portfolios using live market data.
 */
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final PortfolioRepository portfolioRepository;
    private final MarketDataService marketDataService;
    private final JwtService jwtService;

    public DashboardController(PortfolioRepository portfolioRepository,
                               MarketDataService marketDataService,
                               JwtService jwtService) {
        this.portfolioRepository = portfolioRepository;
        this.marketDataService = marketDataService;
        this.jwtService = jwtService;
    }

    /**
     * GET /dashboard/summary — Aggregated overview for the authenticated user.
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummary>> getSummary(
            HttpServletRequest request) {
        UUID userId = extractUserId(request);
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        int holdingCount = 0;
        List<TopHolding> allHoldings = new ArrayList<>();

        for (Portfolio portfolio : portfolios) {
            for (Holding h : portfolio.getHoldings()) {
                holdingCount++;
                Asset asset = h.getAsset();
                BigDecimal price = marketDataService.getPrice(
                        asset.getTicker(), h.getAvgBuyPrice());
                BigDecimal marketValue = h.getQuantity().multiply(price);
                BigDecimal costBasis = h.getCostBasis();
                BigDecimal pnL = marketValue.subtract(costBasis);
                BigDecimal pnLPct = FinanceUtils.pctChange(costBasis, marketValue);

                totalValue = totalValue.add(marketValue);
                totalCost = totalCost.add(costBasis);

                allHoldings.add(new TopHolding(
                        asset.getTicker(), asset.getName(),
                        FinanceUtils.roundCurrency(marketValue),
                        FinanceUtils.roundCurrency(pnL),
                        pnLPct.setScale(2, RoundingMode.HALF_UP),
                        BigDecimal.ZERO)); // weight calculated below
            }
        }

        // Calculate weights and sort by value (top 5)
        BigDecimal finalTotal = totalValue;
        List<TopHolding> topHoldings = allHoldings.stream()
                .map(h -> new TopHolding(
                        h.ticker(), h.name(), h.marketValue(), h.pnL(), h.pnLPct(),
                        finalTotal.compareTo(BigDecimal.ZERO) > 0
                                ? h.marketValue().divide(finalTotal, 4, RoundingMode.HALF_UP)
                                        .multiply(BigDecimal.valueOf(100))
                                        .setScale(1, RoundingMode.HALF_UP)
                                : BigDecimal.ZERO))
                .sorted((a, b) -> b.marketValue().compareTo(a.marketValue()))
                .limit(5)
                .toList();

        BigDecimal totalPnL = totalValue.subtract(totalCost);
        BigDecimal totalPnLPct = FinanceUtils.pctChange(totalCost, totalValue);

        DashboardSummary summary = new DashboardSummary(
                FinanceUtils.roundCurrency(totalValue),
                FinanceUtils.roundCurrency(totalCost),
                FinanceUtils.roundCurrency(totalPnL),
                totalPnLPct.setScale(2, RoundingMode.HALF_UP),
                BigDecimal.ONE,   // placeholder beta
                BigDecimal.ZERO,  // placeholder sharpe
                portfolios.size(),
                holdingCount,
                topHoldings);

        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    private UUID extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String jwt = authHeader.substring(7);
        return UUID.fromString(jwtService.extractUserId(jwt));
    }
}

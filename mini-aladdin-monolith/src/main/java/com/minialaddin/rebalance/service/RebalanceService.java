package com.minialaddin.rebalance.service;

import com.minialaddin.common.exception.ResourceNotFoundException;
import com.minialaddin.market.service.MarketDataService;
import com.minialaddin.portfolio.model.Asset;
import com.minialaddin.portfolio.model.Holding;
import com.minialaddin.portfolio.model.Portfolio;
import com.minialaddin.portfolio.model.TargetAllocation;
import com.minialaddin.portfolio.repository.PortfolioRepository;
import com.minialaddin.rebalance.dto.RebalanceRecommendation;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

/**
 * Compares current portfolio allocation against target allocations
 * and generates BUY/SELL recommendations.
 *
 * Drift threshold: ±2% (absolute). Holdings outside this band
 * receive a recommendation.
 */
@Service
public class RebalanceService {

    private static final BigDecimal DRIFT_THRESHOLD = BigDecimal.valueOf(2.0); // 2%

    private final PortfolioRepository portfolioRepository;
    private final MarketDataService marketDataService;

    public RebalanceService(PortfolioRepository portfolioRepository,
                            MarketDataService marketDataService) {
        this.portfolioRepository = portfolioRepository;
        this.marketDataService = marketDataService;
    }

    /**
     * Analyze a portfolio's allocation drift and return rebalance recommendations.
     */
    public List<RebalanceRecommendation> analyze(UUID portfolioId) {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Portfolio not found: " + portfolioId));

        List<Holding> holdings = portfolio.getHoldings();
        List<TargetAllocation> targets = portfolio.getTargetAllocations();

        if (holdings.isEmpty()) return List.of();

        // If no targets are set, use equal-weight allocation across asset types
        Map<String, BigDecimal> targetPctByType = new LinkedHashMap<>();
        if (targets.isEmpty()) {
            // Default: equal-weight across distinct asset types in portfolio
            Set<String> types = new LinkedHashSet<>();
            for (Holding h : holdings) {
                types.add(h.getAsset().getAssetType().name());
            }
            BigDecimal equalPct = BigDecimal.valueOf(100)
                    .divide(BigDecimal.valueOf(types.size()), 2, RoundingMode.HALF_UP);
            for (String type : types) {
                targetPctByType.put(type, equalPct);
            }
        } else {
            for (TargetAllocation ta : targets) {
                targetPctByType.put(ta.getAssetType().name(), ta.getTargetPct());
            }
        }

        // Calculate current value by asset type
        BigDecimal totalValue = BigDecimal.ZERO;
        Map<String, BigDecimal> valueByType = new LinkedHashMap<>();
        Map<String, List<Holding>> holdingsByType = new LinkedHashMap<>();

        for (Holding h : holdings) {
            Asset asset = h.getAsset();
            String type = asset.getAssetType().name();
            BigDecimal price = marketDataService.getPrice(
                    asset.getTicker(), h.getAvgBuyPrice());
            BigDecimal value = h.getQuantity().multiply(price);
            totalValue = totalValue.add(value);
            valueByType.merge(type, value, BigDecimal::add);
            holdingsByType.computeIfAbsent(type, k -> new ArrayList<>()).add(h);
        }

        if (totalValue.compareTo(BigDecimal.ZERO) == 0) return List.of();

        // Generate recommendations per asset type
        List<RebalanceRecommendation> recommendations = new ArrayList<>();
        BigDecimal finalTotal = totalValue;

        for (Map.Entry<String, BigDecimal> entry : targetPctByType.entrySet()) {
            String type = entry.getKey();
            BigDecimal target = entry.getValue();
            BigDecimal currentValue = valueByType.getOrDefault(type, BigDecimal.ZERO);
            BigDecimal currentPct = currentValue
                    .divide(finalTotal, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP);
            BigDecimal drift = currentPct.subtract(target);

            // Only recommend if drift exceeds threshold
            if (drift.abs().compareTo(DRIFT_THRESHOLD) <= 0) continue;

            String action = drift.compareTo(BigDecimal.ZERO) > 0 ? "SELL" : "BUY";
            BigDecimal targetValue = finalTotal.multiply(target)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal adjustValue = targetValue.subtract(currentValue).abs()
                    .setScale(2, RoundingMode.HALF_UP);

            // Find the top holding in this asset type to attach the recommendation to
            List<Holding> typeHoldings = holdingsByType.getOrDefault(type, List.of());
            String ticker = typeHoldings.isEmpty() ? type
                    : typeHoldings.get(0).getAsset().getTicker();

            String reason = String.format(
                    "%s allocation is %.1f%% (target: %.1f%%). %s $%s to rebalance.",
                    type, currentPct, target, action,
                    adjustValue.toPlainString());

            recommendations.add(new RebalanceRecommendation(
                    ticker, action, currentPct, target,
                    drift.setScale(1, RoundingMode.HALF_UP),
                    adjustValue, reason));
        }

        // Check for asset types in portfolio but not in targets
        for (Map.Entry<String, BigDecimal> entry : valueByType.entrySet()) {
            String type = entry.getKey();
            if (!targetPctByType.containsKey(type)) {
                BigDecimal currentPct = entry.getValue()
                        .divide(finalTotal, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(1, RoundingMode.HALF_UP);

                List<Holding> typeHoldings = holdingsByType.get(type);
                String ticker = typeHoldings.get(0).getAsset().getTicker();

                recommendations.add(new RebalanceRecommendation(
                        ticker, "SELL", currentPct, BigDecimal.ZERO,
                        currentPct, entry.getValue().setScale(2, RoundingMode.HALF_UP),
                        type + " is not in your target allocation. Consider selling."));
            }
        }

        return recommendations;
    }
}

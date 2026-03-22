package com.minialaddin.marketdata.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.marketdata.model.MarketPrice;
import com.minialaddin.marketdata.service.MarketDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for fetching market prices.
 */
@RestController
@RequestMapping("/prices")
public class MarketDataController {

    private final MarketDataService marketDataService;

    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    /**
     * GET /prices/{ticker} — Get the latest price for a ticker.
     * Optional query param: exchange (default: NASDAQ)
     */
    @GetMapping("/{ticker}")
    public ResponseEntity<ApiResponse<MarketPrice>> getPrice(
            @PathVariable String ticker,
            @RequestParam(defaultValue = "NASDAQ") String exchange) {
        MarketPrice price = marketDataService.getPrice(ticker.toUpperCase(), exchange.toUpperCase());
        if (price == null) {
            return ResponseEntity.ok(ApiResponse.error("Price not available for " + ticker));
        }
        return ResponseEntity.ok(ApiResponse.ok(price));
    }

    /**
     * POST /prices/batch — Get prices for multiple tickers.
     * Request body: list of ticker strings.
     * Optional query param: exchange (default: NASDAQ)
     */
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<MarketPrice>>> getBatchPrices(
            @RequestBody List<String> tickers,
            @RequestParam(defaultValue = "NASDAQ") String exchange) {
        List<String> upperTickers = tickers.stream()
                .map(String::toUpperCase)
                .toList();
        List<MarketPrice> prices = marketDataService.getBatchPrices(upperTickers, exchange.toUpperCase());
        return ResponseEntity.ok(ApiResponse.ok(prices));
    }
}

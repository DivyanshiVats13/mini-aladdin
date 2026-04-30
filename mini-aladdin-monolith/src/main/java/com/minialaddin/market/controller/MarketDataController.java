package com.minialaddin.market.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.market.dto.QuoteResponse;
import com.minialaddin.market.service.MarketDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * REST controller for real-time market data.
 */
@RestController
@RequestMapping("/market")
public class MarketDataController {

    private final MarketDataService marketDataService;

    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    /**
     * GET /market/quote/{ticker} — Get current price for a single ticker.
     */
    @GetMapping("/quote/{ticker}")
    public ResponseEntity<ApiResponse<QuoteResponse>> getQuote(
            @PathVariable String ticker) {
        QuoteResponse quote = marketDataService.getQuote(ticker);
        if (quote == null) {
            return ResponseEntity.ok(ApiResponse.error(
                    "Unable to fetch quote for " + ticker));
        }
        return ResponseEntity.ok(ApiResponse.ok(quote));
    }

    /**
     * GET /market/batch?tickers=AAPL,MSFT,GOOGL — Get quotes for multiple tickers.
     */
    @GetMapping("/batch")
    public ResponseEntity<ApiResponse<List<QuoteResponse>>> getBatchQuotes(
            @RequestParam String tickers) {
        String[] symbols = tickers.split(",");
        List<QuoteResponse> quotes = new ArrayList<>();
        for (String symbol : symbols) {
            QuoteResponse quote = marketDataService.getQuote(symbol.trim());
            if (quote != null) quotes.add(quote);
        }
        return ResponseEntity.ok(ApiResponse.ok(quotes));
    }
}

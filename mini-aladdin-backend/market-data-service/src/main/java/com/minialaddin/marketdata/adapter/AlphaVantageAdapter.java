package com.minialaddin.marketdata.adapter;

import com.minialaddin.marketdata.model.MarketPrice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Fetches stock quotes from Alpha Vantage GLOBAL_QUOTE endpoint.
 * Free tier: 25 requests/day.
 */
@Component
public class AlphaVantageAdapter implements MarketDataAdapter {

    private static final Logger log = LoggerFactory.getLogger(AlphaVantageAdapter.class);
    private static final String BASE_URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=%s&apikey=%s";

    @Value("${app.market-data.alpha-vantage-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    @SuppressWarnings("unchecked")
    public MarketPrice fetchPrice(String ticker, String exchange) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Alpha Vantage API key not configured — returning null for {}", ticker);
            return null;
        }

        try {
            String url = String.format(BASE_URL, ticker, apiKey);
            Map<String, Object> body = restTemplate.getForObject(url, Map.class);

            if (body == null || !body.containsKey("Global Quote")) {
                log.warn("No data from Alpha Vantage for {}", ticker);
                return null;
            }

            Map<String, String> quote = (Map<String, String>) body.get("Global Quote");

            if (quote == null || quote.isEmpty()) {
                log.warn("Empty quote from Alpha Vantage for {}", ticker);
                return null;
            }

            return new MarketPrice(
                    ticker,
                    exchange,
                    new BigDecimal(quote.getOrDefault("05. price", "0")),
                    new BigDecimal(quote.getOrDefault("08. previous close", "0")),
                    new BigDecimal(quote.getOrDefault("09. change", "0")),
                    new BigDecimal(quote.getOrDefault("10. change percent", "0")
                            .replace("%", "")),
                    parseLong(quote.getOrDefault("06. volume", "0")));

        } catch (Exception e) {
            log.error("Error fetching price from Alpha Vantage for {}: {}", ticker, e.getMessage());
            return null;
        }
    }

    @Override
    public String getAdapterName() {
        return "AlphaVantage";
    }

    private Long parseLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}

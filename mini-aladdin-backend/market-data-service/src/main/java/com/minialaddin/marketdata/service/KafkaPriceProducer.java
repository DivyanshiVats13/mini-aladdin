package com.minialaddin.marketdata.service;

import com.minialaddin.marketdata.model.MarketPrice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * Publishes price tick events to the "market.prices" Kafka topic.
 */
@Component
public class KafkaPriceProducer {

    private static final Logger log = LoggerFactory.getLogger(KafkaPriceProducer.class);
    private static final String TOPIC = "market.prices";

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaPriceProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Publish a price update event.
     * Key = ticker, Value = "ticker|price|changeAmount|changePct|timestamp"
     */
    public void publishPriceTick(MarketPrice price) {
        try {
            String message = String.join("|",
                    price.getTicker(),
                    price.getPrice().toPlainString(),
                    price.getChangeAmount() != null ? price.getChangeAmount().toPlainString() : "0",
                    price.getChangePct() != null ? price.getChangePct().toPlainString() : "0",
                    price.getFetchedAt().toString());

            kafkaTemplate.send(TOPIC, price.getTicker(), message);
            log.debug("Published price tick for {} to Kafka: {}", price.getTicker(), message);
        } catch (Exception e) {
            log.warn("Failed to publish price tick for {} to Kafka: {}",
                    price.getTicker(), e.getMessage());
        }
    }
}

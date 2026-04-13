package com.minialaddin.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;

/**
 * Lazily initializes the database schema on first application use.
 * This runs AFTER the web server port is open (via @EventListener),
 * so Render sees a healthy container before we touch the DB.
 */
@Configuration
public class SchemaInitializer {

    private static final Logger log = LoggerFactory.getLogger(SchemaInitializer.class);

    private final DataSource dataSource;

    public SchemaInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void initializeSchema() {
        try {
            log.info("Initializing database schema...");
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource("schema.sql"));
            populator.setContinueOnError(true); // Don't crash if tables exist
            populator.execute(dataSource);
            log.info("Database schema initialized successfully.");
        } catch (Exception e) {
            log.warn("Schema initialization failed (app will still run): {}", e.getMessage());
            // Don't crash — the app should still serve requests
        }
    }
}

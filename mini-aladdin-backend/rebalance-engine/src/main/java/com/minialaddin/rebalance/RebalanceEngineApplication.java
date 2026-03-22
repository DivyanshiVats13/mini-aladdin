package com.minialaddin.rebalance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.minialaddin.rebalance", "com.minialaddin.common"})
public class RebalanceEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(RebalanceEngineApplication.class, args);
    }
}

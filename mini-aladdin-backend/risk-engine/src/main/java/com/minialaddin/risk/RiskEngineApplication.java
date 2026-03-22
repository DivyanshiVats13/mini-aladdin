package com.minialaddin.risk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.minialaddin.risk", "com.minialaddin.common"})
public class RiskEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(RiskEngineApplication.class, args);
    }
}

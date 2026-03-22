package com.minialaddin.stresstest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.minialaddin.stresstest", "com.minialaddin.common"})
public class StressTestServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(StressTestServiceApplication.class, args);
    }
}

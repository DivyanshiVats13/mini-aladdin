package com.minialaddin.portfolio.repository;

import com.minialaddin.portfolio.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {

    /** Find all portfolios belonging to a user. */
    List<Portfolio> findByUserId(UUID userId);
}

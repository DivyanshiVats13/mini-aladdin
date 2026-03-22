package com.minialaddin.portfolio.repository;

import com.minialaddin.portfolio.model.TargetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TargetAllocationRepository extends JpaRepository<TargetAllocation, UUID> {

    List<TargetAllocation> findByPortfolioId(UUID portfolioId);

    void deleteByPortfolioId(UUID portfolioId);
}

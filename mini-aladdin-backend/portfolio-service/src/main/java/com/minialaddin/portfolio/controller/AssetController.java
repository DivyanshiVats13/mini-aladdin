package com.minialaddin.portfolio.controller;

import com.minialaddin.common.dto.ApiResponse;
import com.minialaddin.portfolio.model.Asset;
import com.minialaddin.portfolio.service.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for the asset catalogue.
 */
@RestController
@RequestMapping("/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    /**
     * GET /assets — List all assets, optionally filtered by search query.
     * Example: GET /assets?search=AAPL
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Asset>>> listAssets(
            @RequestParam(required = false) String search) {
        List<Asset> assets = assetService.listAssets(search);
        return ResponseEntity.ok(ApiResponse.ok(assets));
    }

    /**
     * GET /assets/{id} — Get a single asset by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Asset>> getAsset(@PathVariable UUID id) {
        Asset asset = assetService.getAsset(id);
        return ResponseEntity.ok(ApiResponse.ok(asset));
    }
}

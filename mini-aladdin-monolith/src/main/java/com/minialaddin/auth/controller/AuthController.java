package com.minialaddin.auth.controller;

import com.minialaddin.auth.dto.AuthResponse;
import com.minialaddin.auth.dto.LoginRequest;
import com.minialaddin.auth.dto.RegisterRequest;
import com.minialaddin.auth.service.AuthService;
import com.minialaddin.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Auth REST controller — registration, login, and profile endpoints.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /auth/register — Register a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    /**
     * POST /auth/login — Authenticate and receive JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    /**
     * GET /auth/me — Get the current authenticated user's profile.
     * Requires a valid JWT in the Authorization header.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> me(Authentication authentication) {
        String email = authentication.getName();
        AuthResponse response = authService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}

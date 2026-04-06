package com.minialaddin.auth.dto;

import com.minialaddin.common.dto.Tier;

/**
 * Authentication response — returned on successful register / login.
 */
public record AuthResponse(
        String token,
        String email,
        String fullName,
        Tier tier) {
}

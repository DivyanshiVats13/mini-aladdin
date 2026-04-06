package com.minialaddin.auth.service;

import com.minialaddin.auth.dto.AuthResponse;
import com.minialaddin.auth.dto.LoginRequest;
import com.minialaddin.auth.dto.RegisterRequest;
import com.minialaddin.auth.model.Subscription;
import com.minialaddin.auth.model.User;
import com.minialaddin.auth.repository.SubscriptionRepository;
import com.minialaddin.auth.repository.UserRepository;
import com.minialaddin.common.dto.Tier;
import com.minialaddin.common.exception.BadRequestException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Auth business logic — registration and login.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
            SubscriptionRepository subscriptionRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Register a new user.
     * 1. Check for duplicate email
     * 2. Hash password with BCrypt
     * 3. Save User entity
     * 4. Create a FREE-tier Subscription
     * 5. Generate and return JWT
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered: " + request.email());
        }

        // Create and save user
        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.fullName());
        user = userRepository.save(user);

        // Create free subscription
        Subscription subscription = new Subscription(user, Tier.FREE);
        subscriptionRepository.save(subscription);

        // Generate JWT
        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getTier());
    }

    /**
     * Authenticate an existing user.
     * 1. Authenticate via Spring Security AuthenticationManager
     * 2. Load user from DB
     * 3. Generate and return JWT
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getTier());
    }

    /**
     * Get the current authenticated user's profile.
     */
    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(null, user.getEmail(), user.getFullName(), user.getTier());
    }
}

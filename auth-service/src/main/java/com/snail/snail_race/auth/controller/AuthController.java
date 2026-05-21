package com.snail.snail_race.auth.controller;

import com.snail.snail_race.auth.dto.LoginRequest;
import com.snail.snail_race.auth.dto.LoginResponse;
import com.snail.snail_race.auth.dto.RegisterRequest;
import com.snail.snail_race.auth.service.UserService;
import com.snail.snail_race.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.success("UP", "auth-service is running");
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(userService.login(request), "Login successful");
    }

    @PostMapping("/signup")
    public ApiResponse<Void> signup(@Valid @RequestBody RegisterRequest request) {
        userService.signup(request);
        return ApiResponse.success(null, "Signup successful");
    }
}

package com.swu.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swu.auth.service.TokenService;
import com.swu.global.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "Token", description = "토큰 관련 API")
public class TokenController {

    private final TokenService tokenService;

    @PostMapping("/reissue")
    @Operation(summary = "토큰 재발급", description = "Refresh 토큰을 검증하여 새로운 Access/Refresh 토큰을 재발급합니다.")
    public ResponseEntity<ApiResponse<Void>> reissue(HttpServletRequest request, HttpServletResponse response) {
        return tokenService.reissueToken(request, response);
    }
}
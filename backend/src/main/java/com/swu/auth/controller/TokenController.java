package com.swu.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swu.auth.jwt.JWTUtil;
import com.swu.global.response.ApiResponse;

import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * - Access/Refresh 토큰 재발급 컨트롤러
 * - 클라이언트가 refresh 토큰을 쿠키에 담아 요청하면
 * - 새로운 access/refresh 토큰을 재발급해서 응답에 포함
 * - access 토큰은 응답 헤더(Authorization), refresh 토큰은 HttpOnly 쿠키로 반환
 * - refresh 토큰의 유효성/타입을 검증하고, rotate 방식 적용
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Tag(name = "Token", description = "토큰 관련 API")
public class TokenController {

    private final JWTUtil jwtUtil;

    @PostMapping("/reissue")
    @Operation(summary = "토큰 재발급", description = "Refresh 토큰을 검증하여 새로운 Access/Refresh 토큰을 재발급합니다.")
    public ResponseEntity<ApiResponse<Void>> reissue(HttpServletRequest request, HttpServletResponse response) {

        // 1. 쿠키에서 refresh 토큰 꺼내기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refresh = cookie.getValue();
                }
            }
        }

        if (refresh == null || refresh.isBlank()) {
            log.warn("refresh token 누락");
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure("refresh token null"));
        }

        // 2. 만료 여부 검사
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            log.warn("refresh token 만료됨");
            return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.failure("refresh token expired"));
        } 

        // 3. 토큰 타입 확인
        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) {
            log.warn("잘못된 토큰 타입: {} (expect: refresh)", category);
            return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.failure("invalid token type"));
        }

        // 4. 새로운 access/refresh 토큰 생성
        Long id = (long) jwtUtil.getId(refresh);
        String role = jwtUtil.getRole(refresh);
        String newAccess = jwtUtil.createJwt("access", role, id, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", role, id, 86400000L);

        // 5. 쿠키와 헤더에 access/refresh 토큰 추가 (Refresh Rotate)
        response.setHeader("Authorization", "Bearer " + newAccess);
        response.addCookie(createCookie("refresh", newRefresh));

        log.info("access/refresh token 재발급 완료 - userId: {}", id);

        return ResponseEntity.ok(ApiResponse.success("access/refresh token 재발급 완료", null));
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        cookie.setHttpOnly(true);
    
        return cookie;
    }
}
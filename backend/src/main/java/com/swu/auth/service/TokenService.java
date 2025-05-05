package com.swu.auth.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.swu.auth.jwt.JWTUtil;
import com.swu.global.response.ApiResponse;

import io.jsonwebtoken.ExpiredJwtException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Refresh Token을 검증하고 Access/Refresh Token을 재발급하는 서비스
 * - Refresh Token 유효성 및 타입 검증
 * - Rotate 방식 적용 (재발급 시 기존 Refresh는 폐기 전제)
 * - Access Token은 Authorization 헤더로, Refresh는 HttpOnly 쿠키로 반환
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {

    private final JWTUtil jwtUtil;

    public ResponseEntity<ApiResponse<Void>> reissueToken(HttpServletRequest request, HttpServletResponse response) {

        // 1. 쿠키에서 refresh 토큰 꺼내기
        String refresh = extractRefreshToken(request);

        if (refresh == null || refresh.isBlank()) {
            log.warn("refresh token 누락");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("refresh token null"));
        }

        // 2. 만료 여부 검사
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            log.warn("refresh token 만료됨");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("refresh token expired"));
        }

        // 3. 토큰 타입 확인
        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) {
            log.warn("잘못된 토큰 타입: {} (expect: refresh)", category);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
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

    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        for (Cookie cookie : cookies) {
            if ("refresh".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }
    
}

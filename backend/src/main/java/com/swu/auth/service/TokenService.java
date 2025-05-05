package com.swu.auth.service;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
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
 * - Rotate 방식 적용 (재발급 시 기존 Refresh는 폐기)
 * - Access Token은 Authorization 헤더로, Refresh는 HttpOnly 쿠키로 반환
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {

    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

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

        // 4. JWT에서 유저 정보 파싱
        Long id = (long) jwtUtil.getId(refresh);
        String role = jwtUtil.getRole(refresh);

        // 5. Redis에서 저장된 refresh 토큰과 비교
        String redisKey = "refresh:user:" + id;
        String savedRefresh = (String) redisTemplate.opsForValue().get(redisKey);
        if (!refresh.equals(savedRefresh)) {
            log.warn("유효하지 않은 refresh 토큰 요청 - userId: {}", id);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.failure("invalid refresh token"));
        }

        // 6. 새로운 access/refresh 토큰 생성
        String newAccess = jwtUtil.createJwt("access", role, id, 600000L);
        String newRefresh = jwtUtil.createJwt("refresh", role, id, 86400000L);

        // 7. Redis에 새로운 refresh 토큰 저장 (기존 토큰은 삭제)
        redisTemplate.opsForValue().set("refresh:user:" + id, newRefresh, 24, TimeUnit.HOURS);

        // 8. 쿠키와 헤더에 access/refresh 토큰 추가 (Refresh Rotate)
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

package com.swu.auth.jwt;

import java.io.IOException;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.GenericFilterBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swu.global.response.ApiResponse;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Refresh 토큰 기반 로그아웃 처리 필터
 * - 요청 URI가 "/logout"이고 POST 방식일 경우 동작
 * - 쿠키에서 refresh 토큰을 추출하여 검증
 * - Redis에서 해당 토큰 삭제 (단일 토큰 관리 방식 기준)
 * - 클라이언트 쿠키 제거 및 성공 응답 반환
 */
@Slf4j
@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean{

    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        // 1. URI 및 메서드 확인
        if (!request.getRequestURI().matches("^/api/auth/logout$") || !request.getMethod().equalsIgnoreCase("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        log.info("로그아웃 요청 수신");

        // 2. 쿠키에서 Refresh 토큰 추출
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh".equals(cookie.getName())) {
                    refresh = cookie.getValue();
                }
            }
        }
     
        if (refresh == null || refresh.isBlank()) {
            log.warn("Refresh 토큰 없음");

            sendJsonError(response, HttpStatus.BAD_REQUEST, "refresh token is missing");
            return;
        }

        // 3. 만료 확인
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            log.warn("만료된 refresh token으로 로그아웃 시도");

            sendJsonError(response, HttpStatus.BAD_REQUEST, "refresh token is expired");
            return;
        }

        // 4. 토큰 타입 확인
        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) {
            log.warn("refresh 토큰 아님. category: {}", category);

            sendJsonError(response, HttpStatus.BAD_REQUEST, "invalid token type");
            return;
        }

        // 5. Redis에서 해당 유저의 토큰 삭제
        Long userId = (long) jwtUtil.getId(refresh);
        String redisKey = "refresh:user:" + userId;
        redisTemplate.delete(redisKey);        

        log.info("Redis에서 refresh 토큰 삭제 완료 - userId: {}", userId);

        // 6. 쿠키 삭제
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        // 7. 성공 응답 반환
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Void> apiResponse = ApiResponse.success("로그아웃 완료", null);
        String responseBody = new ObjectMapper().writeValueAsString(apiResponse);
        response.getWriter().write(responseBody);

        log.info("로그아웃 처리 완료 - userId: {}", userId);
    }
    
      private void sendJsonError(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Void> apiResponse = ApiResponse.failure(message);
        String responseBody = new ObjectMapper().writeValueAsString(apiResponse);
        response.getWriter().write(responseBody);
    }
}

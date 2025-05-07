package com.swu.auth.jwt;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swu.auth.entity.PrincipalDetails;
import com.swu.domain.user.entity.Role;
import com.swu.domain.user.entity.User;
import com.swu.global.response.ApiResponse;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Slf4j
public class JWTFilter extends OncePerRequestFilter{

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        
        if (path.startsWith("/api/auth")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 헤더에서 Authorization키에 담긴 토큰을 꺼내기
        String accessToken = request.getHeader("Authorization");
        
        // 토큰이 없거나 Bearer로 시작하지 않으면 필터 체인 진행
        if (accessToken == null || !accessToken.startsWith("Bearer")) {
            log.warn("토큰이 없거나 Bearer로 시작하지 않음");
            filterChain.doFilter(request, response);
            return;
        }

        // Bearer 부분 제거 후 순수 토큰 획득
        String token = accessToken.split(" ")[1];

        // 토큰 소멸 시간 검증
        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {
            log.warn("만료된 Access Token - IP: {}, Path: {}", request.getRemoteAddr(), request.getRequestURI());

            // 1. 응답 상태코드 설정
            response.setStatus(HttpStatus.UNAUTHORIZED.value());

            // 2. 응답 헤더 설정
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // 3. 응답 바디 구성
            ApiResponse<Void> apiResponse = ApiResponse.failure("Access token expired");
            String responseBody = new ObjectMapper().writeValueAsString(apiResponse);
            response.getWriter().write(responseBody);

            return; 
        }

        // 토큰이 access인지 확인
        String category = jwtUtil.getCategory(token);

        if (!category.equals("access")) {
            log.warn("Access 토큰 아님 - category: {}, Path: {}", category, path);

            // 1. 응답 상태코드 설정
            response.setStatus(HttpStatus.UNAUTHORIZED.value());

            // 2. 응답 헤더 설정
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // 3. 응답 바디 구성
            ApiResponse<Void> apiResponse = ApiResponse.failure("Invalid access token");
            String responseBody = new ObjectMapper().writeValueAsString(apiResponse);
            response.getWriter().write(responseBody);

            return; 
        }

        // 토큰에서 사용자 정보 가져오기
        Integer id = jwtUtil.getId(token);
        String role = jwtUtil.getRole(token);

        Role roleType;
        roleType = Role.valueOf(role);

        // UserEntity를 생성하여 값 set
        User user = User.builder()
                .id((long) id)
                .role(roleType)
                .build();

        // UserDetails에 회원 정보 객체 담기
        PrincipalDetails principal = new PrincipalDetails(user);

        // 스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        // 세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        log.info("인증 완료 - userId: {}, role: {}", id, role);
        filterChain.doFilter(request, response);
    }
}
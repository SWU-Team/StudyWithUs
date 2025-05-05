package com.swu.auth.jwt;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import com.swu.auth.dto.request.LoginRequest;
import com.swu.auth.entity.CustomUserDetails;
import com.swu.global.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StreamUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// JWT 사용한 인증 방식을 구현을 위해 커스텀 필터 작성.
// UsernamePasswordAuthenticationFilter -> 로그인 가로챔
@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter{

    // 인증 요청 처리, 사용자 인증 정보 검증하는 역할.
    // 커스텀 필터에서 사용하기 위해 주입받음
    private final  AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    public LoginFilter (AuthenticationManager authenticationManager, JWTUtil jwtUtil, RedisTemplate<String, Object> redisTemplate) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;

        setFilterProcessesUrl("/api/auth/login");
    }

    // 로그인 요청을 처리하는 메소드
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException  {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            LoginRequest loginRequest = objectMapper.readValue(messageBody, LoginRequest.class);

            String username = loginRequest.getEmail();
            String password = loginRequest.getPassword();

            // 인증 토큰 생성
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

            // 인증 시도
            return authenticationManager.authenticate(authToken);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    //로그인 성공시 실행하는 메소드
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        Long  id = customUserDetails.getUser().getId();
        String nickname = customUserDetails.getUser().getNickname();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();

        // 토큰 생성
        String token = jwtUtil.createJwt("access", role, id, 600000L); // 10분
        String refresh = jwtUtil.createJwt("refresh", role, id, 86400000L); // 24시간

        // Redis에 refresh 토큰 저장 (유저 1명당 1개의 refresh 토큰만 유지)
        redisTemplate.opsForValue().set("refresh:user:" + id, refresh, 24, TimeUnit.HOURS);

        // 응답 설정
        response.setHeader("Authorization", "Bearer " + token);
        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> data = new HashMap<>();
        data.put("id", id);
        data.put("nickname", nickname);

        ApiResponse<Map<String, Object>> apiResponse = ApiResponse.success("로그인 성공", data);

        ObjectMapper objectMapper = new ObjectMapper();
        try{
            String responseBody = objectMapper.writeValueAsString(apiResponse);
            response.getWriter().write(responseBody);
        } catch (IOException e) {
            log.error("JSON 직렬화 중 오류 발생", e);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }

        log.info("로그인 성공: {} (id: {})", nickname, id);
    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Void> apiResponse = ApiResponse.failure("이메일 또는 비밀번호가 올바르지 않습니다.");

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String responseBody = objectMapper.writeValueAsString(apiResponse);
            response.getWriter().write(responseBody);
        } catch (IOException e) {
            log.error("JSON 직렬화 중 오류 발생", e);
        }

        log.warn("로그인 실패");
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
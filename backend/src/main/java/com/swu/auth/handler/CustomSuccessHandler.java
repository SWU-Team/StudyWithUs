package com.swu.auth.handler;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import com.swu.auth.entity.PrincipalDetails;
import com.swu.auth.jwt.JWTUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * - OAuth2 로그인 성공 시 실행되는 핸들러 클래스
 * - 인증 객체에서 사용자 정보를 꺼내고, Refresh Token을 발급하여  Redis에 저장하고 클라이언트에 쿠키로 전달함
 * - 이후 프론트엔드로 리다이렉트 처리
 */
@Slf4j
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        
        // 1. 인증 객체에서 PrincipalDetails 꺼내기
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        Long  id = principal.getUser().getId();
        String nickname = principal.getUser().getNickname();
        String role = "ROLE_" + principal.getUser().getRole().name();

        // 2. Refresh Token 발급
        String refresh = jwtUtil.createJwt("refresh", role, id, 86400000L); 

        // 3. Redis에 Refresh Token 저장
        redisTemplate.opsForValue().set("refresh:user:" + id, refresh, 24, TimeUnit.HOURS);

        // 4. Refresh 토큰을 쿠키로 클라이언트에 전달
        response.setStatus(HttpStatus.OK.value());
        response.addCookie(createCookie("refresh", refresh));

        // 5. OAuth2 로그인 후 리다이렉트 처리
        String redirectUrl;
        switch (principal.getUser().getRole()) {
            case PREUSER -> redirectUrl = "http://localhost:3000/complete-info";
            case USER -> redirectUrl = "http://localhost:3000/rooms";
            default -> redirectUrl = "http://localhost:3000/";
        }

        response.sendRedirect(redirectUrl); 

        log.info("OAuth 로그인 성공: {}, 역할: {}", nickname, role);
    }

     private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}

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

@Slf4j
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();

        Long  id = principal.getUser().getId();
        String nickname = principal.getUser().getNickname();
        String role = "ROLE_" + principal.getUser().getRole().name();

        
        // 리프레시 토큰 발급
        String refresh = jwtUtil.createJwt("refresh", role, id, 86400000L); 

        // Redis에 리프레시 토큰 저장
        redisTemplate.opsForValue().set("refresh:user:" + id, refresh, 24, TimeUnit.HOURS);

        // 응답 설정
        response.setStatus(HttpStatus.OK.value());
        response.addCookie(createCookie("refresh", refresh));
        response.sendRedirect("http://localhost:3000/");

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

package com.swu.auth.jwt;

import java.io.IOException;

import com.swu.auth.entity.CustomUserDetails;
import com.swu.domain.user.entity.Role;
import com.swu.domain.user.entity.User;

import lombok.extern.slf4j.Slf4j;
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
                || path.startsWith("/ws")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer")) {
            log.warn("토큰이 없거나 Bearer로 시작하지 않음");
            filterChain.doFilter(request, response);
            return;
        }

        log.debug("Authorization header found");

        // Bearer 부분 제거 후 순수 토큰 획득
        String token = authorization.split(" ")[1];

        // 토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {
            log.warn("토큰 만료됨");
            filterChain.doFilter(request, response);
            return;
        }

        String nickname = jwtUtil.getNickname(token);
        String role = jwtUtil.getRole(token);
        Integer id = jwtUtil.getId(token);

        Role roleType;
        roleType = Role.valueOf(role);

        //userEntity를 생성하여 값 set
        User user = User.builder()
                .id((long) id)
                .nickname(nickname)
                .password("temppassword")
                .role(roleType)
                .build();

        //UserDetails에 회원 정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(user);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        log.info(id + "번 유저 인증 완료");
        filterChain.doFilter(request, response);
    }
}
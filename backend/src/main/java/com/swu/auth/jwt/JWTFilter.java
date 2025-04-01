package com.swu.auth.jwt;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swu.auth.domain.CustomUserDetails;
import com.swu.global.response.ApiResponse;
import com.swu.user.domain.Role;
import com.swu.user.domain.User;
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

        if (path.startsWith("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer")) {

            log.warn("토큰이 없거나 Bearer로 시작하지 않음");
            sendUnauthorizedResponse(response, "토큰이 없거나 형식이 올바르지 않습니다.");

            return;
        }

        log.debug("Authorization header found");

        // Bearer 부분 제거 후 순수 토큰 획득
        String token = authorization.split(" ")[1];

        // 토큰 소멸 시간 검증
        if (jwtUtil.isExpired(token)) {

            log.warn("토큰 만료됨");
            sendUnauthorizedResponse(response, "토큰이 만료되었습니다.");

            return;
        }

        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);
        Integer id = jwtUtil.getId(token);

        log.info("토큰 추출 - email: {}, role: {}, id: {}", username, role, id);

        Role roleType;
        roleType = Role.valueOf(role);

        //userEntity를 생성하여 값 set
        User user = User.builder()
                .id((long) id)
                .email(username)
                .password("temppassword")
                .role(roleType)
                .build();

        //UserDetails에 회원 정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(user);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);
        log.info("User added to SecurityContextHolder");

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Void> apiResponse = ApiResponse.unauthorized(message);  // ApiResponse에 해당 메서드가 있다고 가정
        ObjectMapper objectMapper = new ObjectMapper();
        String responseBody = objectMapper.writeValueAsString(apiResponse);

        response.getWriter().write(responseBody);
    }


}
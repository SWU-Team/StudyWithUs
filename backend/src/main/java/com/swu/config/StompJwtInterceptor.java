package com.swu.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import com.swu.auth.entity.CustomUserDetails;
import com.swu.auth.jwt.JWTUtil;
import com.swu.domain.user.entity.User;
import com.swu.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 - WebSocket STOMP 연결 요청 시 Authorization 헤더의 JWT 토큰을 검증하고,
 - 유효한 경우 인증 객체를 생성하여 STOMP 세션에 주입하는 인터셉터.
**/
@Slf4j
@Component
@RequiredArgsConstructor
public class StompJwtInterceptor implements ChannelInterceptor {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        // STOMP 메시지의 헤더 정보 추출
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // CONNECT 명령일 때만 JWT 인증 처리
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Authorization 헤더에서 토큰 추출
            String token = accessor.getFirstNativeHeader("Authorization");
            
            if (token == null || !token.startsWith("Bearer ")) {
                log.warn("WebSocket 연결 시 Authorization 헤더가 없거나 형식이 잘못됨");
                throw new IllegalArgumentException("Authorization 헤더가 유효하지 않습니다.");
            }

            token = token.substring(7);

             // 1. 토큰 만료 체크
            if (jwtUtil.isExpired(token)) {
                log.warn("만료된 토큰으로 WebSocket 연결 시도 - token: {}", token);
                throw new IllegalArgumentException("JWT 토큰이 만료되었습니다.");
            }

            // 2. 토큰 타입이 access인지 확인
            String category = jwtUtil.getCategory(token);
            if (!category.equals("access")) {
                log.warn("Access 토큰이 아님 - category: {}, token: {}", category, token);
                throw new IllegalArgumentException("Access 토큰이 아닙니다.");
            }

            // 3. 사용자 조회
            Long userId = (long) jwtUtil.getId(token);
            User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("WebSocket 인증 실패 - 존재하지 않는 userId: {}", userId);
                    return new IllegalArgumentException("유효하지 않은 사용자입니다.");
                });

            // 4. 인증 정보 등록
            CustomUserDetails customUserDetails = new CustomUserDetails(user);
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(customUserDetails, token, customUserDetails.getAuthorities());

            accessor.setUser(authentication);

            log.info("WebSocket 인증 성공 - userId: {}, nickname: {}", user.getId(), user.getNickname());
        }
        // 메시지를 다음 단계로 전달!!
        return message;
    }
}

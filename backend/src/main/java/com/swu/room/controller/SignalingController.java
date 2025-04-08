package com.swu.room.controller;

import com.swu.auth.domain.CustomUserDetails;
import com.swu.room.dto.message.SignalingMessage;
import com.swu.room.service.RoomService;
import com.swu.user.domain.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class SignalingController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomService roomService;

    @MessageMapping("/signal")
    public void handleSignal(@Payload @Valid SignalingMessage message, Principal principal) {
        try {
            if (!(principal instanceof UsernamePasswordAuthenticationToken authToken)) {
                throw new SecurityException("인증되지 않은 사용자입니다.");
            }
            
            // 인증된 사용자 정보 추출
            CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();
            User user = userDetails.getUser();

            // 방 접근 권한 검사
            if (!roomService.hasAccessToRoom(message.roomId(), user)) {
                throw new SecurityException("방에 입장할 권한이 없습니다.");
            }

            log.debug("시그널 메시지 수신 - 타입: {}, 방: {}, 발신자: {}", 
                    message.type(), message.roomId(), message.senderNickname());

            String destination = "/sub/room/" + message.roomId();
            messagingTemplate.convertAndSend(destination, message);

        } catch (Exception e) {
            log.error("시그널 처리 중 오류 발생: {}", e.getMessage());
            SignalingMessage errorMessage = SignalingMessage.createError(
                message.roomId(),
                message.senderId(),
                message.senderNickname(),
                e.getMessage()
            );
            messagingTemplate.convertAndSend("/sub/room/" + message.roomId(), errorMessage);
        }
    }

}

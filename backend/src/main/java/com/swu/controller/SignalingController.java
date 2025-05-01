package com.swu.controller;

import com.swu.auth.entity.CustomUserDetails;
import com.swu.domain.room.dto.message.SignalingMessage;
import com.swu.domain.room.service.RoomService;
import com.swu.domain.user.entity.User;

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
    
            CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();
            User user = userDetails.getUser();
    
            if (!roomService.hasAccessToRoom(message.roomId(), user)) {
                throw new SecurityException("방에 입장할 권한이 없습니다.");
            }
    
            log.debug("시그널 메시지 수신 - 타입: {}, 방: {}, 발신자: {}, 수신자: {}",
    
            message.type(), message.roomId(), message.senderNickname(), message.targetId());

            String destination;
            if (message.targetId() != null) {
                destination = "/sub/user/" + message.targetId();
            } else {
                destination = "/sub/room/" + message.roomId();
            }
            log.debug("전송할 목적지: {}", destination);
            log.debug("전송할 메시지: {}", message);
            messagingTemplate.convertAndSend(destination, message);  
        } catch (SecurityException se) {
            log.warn("시큐리티 예외 발생: {}", se.getMessage());
    
            SignalingMessage errorMessage = SignalingMessage.createError(
                    message.roomId(),
                    message.senderId(),
                    message.senderNickname(),
                    se.getMessage()
            );
            messagingTemplate.convertAndSend("/sub/user/" + message.senderId(), errorMessage);
        } catch (Exception e) {
            log.error("시그널 처리 중 오류 발생: {}", e.getMessage());
            SignalingMessage errorMessage = SignalingMessage.createError(
                    message.roomId(),
                    message.senderId(),
                    message.senderNickname(),
                    e.getMessage()
            );
            messagingTemplate.convertAndSend("/sub/user/" + message.senderId(), errorMessage);
        }
    }
}

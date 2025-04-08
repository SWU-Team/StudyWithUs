package com.swu.room.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import com.swu.auth.domain.CustomUserDetails;
import com.swu.room.dto.message.ChatMessage;
import com.swu.room.service.RoomService;
import com.swu.user.domain.User;

import jakarta.validation.Valid;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RoomService roomService;
    @MessageMapping("/chat/message")
    public void handleChatMessage(@Payload @Valid ChatMessage message, Principal principal) {
        try {
            if (!(principal instanceof UsernamePasswordAuthenticationToken authToken)) {
                throw new SecurityException("인증되지 않은 사용자입니다.");
            }

            CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();
            User user = userDetails.getUser();

            if (!roomService.hasAccessToRoom(message.roomId(), user)) {
                throw new SecurityException("방에 입장할 권한이 없습니다.");
            }
            
            // 발신자 정보 보정
            ChatMessage updatedMessage = new ChatMessage(
                message.type(),
                message.roomId(),
                user.getId(),
                user.getNickname(),
                message.message()
            );

            log.debug("채팅 메시지 수신 - 타입: {}, 방: {}, 발신자: {}", 
                updatedMessage.type(), updatedMessage.roomId(), updatedMessage.senderNickname());

            
            String destination = "/sub/chat/room/" + message.roomId();
            messagingTemplate.convertAndSend(destination, updatedMessage);
        } catch (Exception e) {
            log.error("채팅 메시지 처리 중 오류 발생", e);
            return;
        }
    }
}

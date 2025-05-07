package com.swu.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import com.swu.auth.entity.PrincipalDetails;
import com.swu.domain.room.dto.message.ChatMessage;
import com.swu.domain.room.service.ChatService;
import com.swu.domain.room.service.RoomService;
import com.swu.domain.user.entity.User;

import jakarta.validation.Valid;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final RoomService roomService;
    
    @MessageMapping("/chat/message")
    public void handleChatMessage(@Payload @Valid ChatMessage message, Principal principal) {
        if (!(principal instanceof UsernamePasswordAuthenticationToken authToken)) {
            throw new SecurityException("인증되지 않은 사용자입니다.");
        }

        PrincipalDetails userDetails = (PrincipalDetails) authToken.getPrincipal();
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
    
        chatService.sendMessage(updatedMessage);
    }
}

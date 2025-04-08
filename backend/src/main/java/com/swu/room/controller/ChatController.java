package com.swu.room.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.swu.room.dto.message.ChatMessage;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/message")
    public void handleChatMessage(ChatMessage message) {
        log.info("메시지: {}", message);

        Long roomId = message.getRoomId();
        messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, message);
    }
}

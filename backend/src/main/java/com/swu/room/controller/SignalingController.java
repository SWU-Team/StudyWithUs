package com.swu.room.controller;

import com.swu.auth.domain.CustomUserDetails;
import com.swu.room.dto.message.SignalingMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
public class SignalingController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/signal") // 클라이언트 -> /pub/signal
    public void handleSignal(@Payload SignalingMessage message) {

        if (message.getRoomId() == null || message.getRoomId() <= 0) {
            throw new IllegalArgumentException("roomId는 0보다 커야 합니다.");
        }
        if (!List.of("offer", "answer", "ice", "join", "leave").contains(message.getType())) {
            throw new IllegalArgumentException("type이 잘못되었습니다.");
        }

        log.info("Signaling message 수신 : {}", message);

        String destination = "/sub/room/" + message.getRoomId();
        messagingTemplate.convertAndSend(destination,  message);
    }
}

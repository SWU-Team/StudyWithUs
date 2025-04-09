package com.swu.room.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swu.room.dto.message.ChatMessage;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisMessageSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(@NonNull Message message, @Nullable byte[] pattern) {
        try {
            String body = new String(message.getBody());
            ChatMessage chatMessage = objectMapper.readValue(body, ChatMessage.class);

            String destination = "/sub/chat/room/" + chatMessage.roomId();
            messagingTemplate.convertAndSend(destination, chatMessage);
            log.debug("Redis로부터 수신한 메시지를 전송함 - 방: {}", chatMessage.roomId());

        } catch (Exception e) {
            log.error("Redis 메시지 수신 중 오류 발생", e);
        }
    }
}

package com.swu.room.service;

import com.swu.room.dto.message.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ChannelTopic channelTopic;

    public void sendMessage(ChatMessage message) {
        saveMessage(message);
        // chat 채널에 메시지 publish
        redisTemplate.convertAndSend(channelTopic.getTopic(), message);
    }
    
    public void saveMessage(ChatMessage message) {
        String key = "chat:room:" + message.roomId();
        redisTemplate.opsForList().rightPush(key, message);
        log.debug("메시지 저장 - 방: {}, 발신자: {}", message.roomId(), message.senderNickname());
    }
} 
package com.swu.room.dto.message;

public record SignalingMessage(
        String type,
        Long roomId,
        Long senderId,
        String senderNickname,
        Object data
) {}

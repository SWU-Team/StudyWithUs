package com.swu.domain.room.dto.response;

import java.time.LocalDateTime;

public record RoomMemberResponse(
        Long userId,
        String nickname,
        boolean isHost,
        LocalDateTime joinedAt
) {}

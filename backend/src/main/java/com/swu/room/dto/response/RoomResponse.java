package com.swu.room.dto.response;

import java.time.LocalDateTime;

public record RoomResponse(Long id, String title, int maxCapacity, int focusMinute, int breakMinute, int currentMemberCount, LocalDateTime createdAt, String bgnTitle) {}

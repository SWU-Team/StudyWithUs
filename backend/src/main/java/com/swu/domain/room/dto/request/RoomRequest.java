package com.swu.domain.room.dto.request;

public record RoomRequest(String title, int maxCapacity, int focusMinute, int breakMinute) {}

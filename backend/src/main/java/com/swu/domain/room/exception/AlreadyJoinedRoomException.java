package com.swu.domain.room.exception;

public class AlreadyJoinedRoomException extends RuntimeException {
    public AlreadyJoinedRoomException(String message) {
        super(message);
    }
}

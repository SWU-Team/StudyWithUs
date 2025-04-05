package com.swu.global.exception;

import com.swu.global.response.ApiResponse;
import com.swu.room.exception.AlreadyJoinedRoomException;
import com.swu.room.exception.NotJoinedRoomException;
import com.swu.room.exception.RoomFullException;
import com.swu.room.exception.RoomNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleRoomNotFoundException(RoomNotFoundException e) {
        log.warn("RoomNotFoundException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(HttpStatus.NOT_FOUND, e.getMessage()));
    }

    @ExceptionHandler(AlreadyJoinedRoomException.class)
    public ResponseEntity<ApiResponse<Void>> handleAlreadyJoinedRoomException(AlreadyJoinedRoomException e) {
        log.warn("AlreadyJoinedRoomException: {}", e.getMessage()); //
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(HttpStatus.CONFLICT, e.getMessage()));
    }

    @ExceptionHandler(RoomFullException.class)
    public ResponseEntity<ApiResponse<Void>> handleRoomFullException(RoomFullException e) {
        log.warn("RoomFullException: {}", e.getMessage()); //
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(HttpStatus.CONFLICT, e.getMessage()));
    }

    @ExceptionHandler(NotJoinedRoomException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotJoinedRoomException(NotJoinedRoomException e) {
        log.warn("NotJoinedRoomException: {}", e.getMessage()); //
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(HttpStatus.CONFLICT, e.getMessage()));
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception e) {
        log.error("Unexpected error occurred", e); //
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."));
    }
}

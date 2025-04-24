package com.swu.global.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.swu.domain.diary.exception.DiaryAlreadyExistsException;
import com.swu.domain.diary.exception.DiaryNotFoundException;
import com.swu.domain.room.exception.AlreadyJoinedRoomException;
import com.swu.domain.room.exception.NotJoinedRoomException;
import com.swu.domain.room.exception.RoomFullException;
import com.swu.domain.room.exception.RoomNotFoundException;
import com.swu.domain.user.exception.EmailAlreadyExistsException;
import com.swu.domain.user.exception.ImageUploadFailedException;
import com.swu.domain.user.exception.InvalidCurrentPasswordException;
import com.swu.domain.user.exception.InvalidFileException;
import com.swu.domain.user.exception.PasswordRedundancyException;
import com.swu.domain.user.exception.UserNotFoundException;
import com.swu.global.response.ApiResponse;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationExceptions(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult()
            .getFieldErrors()
            .stream()
            .findFirst()
            .map(FieldError::getDefaultMessage)
            .orElse("유효성 검사에 실패했습니다.");

        log.warn("Validation error: {}", errorMessage);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.failure(errorMessage));
    }

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleRoomNotFoundException(RoomNotFoundException e) {
        log.warn("RoomNotFoundException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(AlreadyJoinedRoomException.class)
    public ResponseEntity<ApiResponse<Void>> handleAlreadyJoinedRoomException(AlreadyJoinedRoomException e) {
        log.warn("AlreadyJoinedRoomException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(RoomFullException.class)
    public ResponseEntity<ApiResponse<Void>> handleRoomFullException(RoomFullException e) {
        log.warn("RoomFullException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(NotJoinedRoomException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotJoinedRoomException(NotJoinedRoomException e) {
        log.warn("NotJoinedRoomException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFoundException(UserNotFoundException e) {
        log.warn("UserNotFoundException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        log.warn("EmailAlreadyExistsException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(InvalidCurrentPasswordException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidCurrentPasswordException(InvalidCurrentPasswordException e) {
        log.warn("InvalidCurrentPasswordException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(PasswordRedundancyException.class)
    public ResponseEntity<ApiResponse<Void>> handlePasswordRedundancyException(PasswordRedundancyException e) {
        log.warn("PasswordRedundancyException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(ImageUploadFailedException.class)
    public ResponseEntity<ApiResponse<Void>> handleImageUploadFailedException(ImageUploadFailedException e) {
        log.warn("ImageUploadFailedException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidFileException(InvalidFileException e) {
        log.warn("InvalidFileException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("IllegalArgumentException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(DiaryNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleDiaryNotFoundException(DiaryNotFoundException e) {
        log.warn("DiaryNotFoundException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(DiaryAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleDiaryAlreadyExistsException(DiaryAlreadyExistsException e) {
        log.warn("DiaryAlreadyExistsException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();

        if (cause instanceof InvalidFormatException ife) {
            if ("java.time.LocalDate".equals(ife.getTargetType().getName())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.failure("날짜 형식이 잘못되었습니다. yyyy-MM-dd 형식이어야 합니다."));
            }
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure("요청 본문(JSON)의 형식이 잘못되었습니다."));
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiResponse<Void>> handleSecurityException(SecurityException e) {
        log.warn("SecurityException: {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.failure(e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception e) {
        log.error("Unexpected error occurred", e);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure("서버 내부 오류가 발생했습니다."));
    }
}

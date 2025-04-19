package com.swu.diary.exception;

public class DiaryAlreadyExistsException extends RuntimeException {
    public DiaryAlreadyExistsException() {
        super("해당 날짜에 이미 작성된 일기가 있습니다.");
    }
}

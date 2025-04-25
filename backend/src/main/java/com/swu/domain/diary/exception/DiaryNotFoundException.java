package com.swu.domain.diary.exception;

public class DiaryNotFoundException extends RuntimeException {
    public DiaryNotFoundException() {
        super("일기를 찾을 수 없습니다.");
    }
}

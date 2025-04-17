package com.swu.user.exception;

public class PasswordRedundancyException extends RuntimeException {
    public PasswordRedundancyException() {
        super("새 비밀번호는 기존 비밀번호와 달라야 합니다.");
    }
}

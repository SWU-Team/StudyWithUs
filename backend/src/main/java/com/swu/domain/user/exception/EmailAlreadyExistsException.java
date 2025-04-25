package com.swu.domain.user.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException() {
        super("이미 사용 중인 이메일입니다.");
    }
}

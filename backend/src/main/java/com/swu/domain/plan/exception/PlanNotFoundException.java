package com.swu.domain.plan.exception;

public class PlanNotFoundException extends RuntimeException {
    public PlanNotFoundException() {
        super("해당 플랜을 찾을 수 없습니다.");
    }
}

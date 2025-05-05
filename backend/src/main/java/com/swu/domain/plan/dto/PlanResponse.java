package com.swu.domain.plan.dto;

import com.swu.domain.plan.entity.Plan;
import com.swu.domain.plan.entity.Plan.Priority;

import java.time.LocalDate;

public record PlanResponse(
        Long id,
        String content,
        LocalDate planDate,
        Priority priority,
        boolean isCompleted
) {
    public static PlanResponse from(Plan plan) {
        return new PlanResponse(
                plan.getId(),
                plan.getContent(),
                plan.getPlanDate(),
                plan.getPriority(),
                plan.isCompleted()
        );
    }
}

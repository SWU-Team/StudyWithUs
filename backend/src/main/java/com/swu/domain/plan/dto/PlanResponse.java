package com.swu.domain.plan.dto;

import com.swu.domain.plan.entity.Plan.Priority;

import java.time.LocalDate;

public record PlanResponse(
        Long id,
        String content,
        LocalDate planDate,
        Priority priority,
        boolean isCompleted
) {}

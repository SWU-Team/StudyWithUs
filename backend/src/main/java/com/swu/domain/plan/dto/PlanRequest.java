package com.swu.domain.plan.dto;

import com.swu.domain.plan.entity.Plan.Priority;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PlanRequest(
        @NotBlank(message = "내용은 필수입니다.")
        String content,

        @NotNull(message = "계획일자는 필수입니다.")
        @FutureOrPresent(message = "계획일자는 오늘 또는 미래여야 합니다.")
        LocalDate planDate,

        @NotNull(message = "중요도를 선택해주세요.")
        Priority priority
) {}

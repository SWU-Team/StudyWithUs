package com.swu.domain.diary.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DiaryRequest(
    @NotBlank String title,
    @NotBlank String content,
    @NotNull LocalDate diaryDate,
    @Min(1) @Max(5) int score
) {}

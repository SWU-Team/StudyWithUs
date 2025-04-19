package com.swu.diary.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DiaryRequest(
    @NotBlank String title,
    @NotBlank String content,
    @NotNull LocalDate diaryDate
) {}

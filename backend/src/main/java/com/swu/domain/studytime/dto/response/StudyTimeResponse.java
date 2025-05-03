package com.swu.domain.studytime.dto.response;

import java.time.LocalDate;

public record StudyTimeResponse(
    LocalDate recordDate,
    int totalMinutes
) {}

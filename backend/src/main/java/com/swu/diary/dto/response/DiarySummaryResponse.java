package com.swu.diary.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.swu.diary.domain.Diary;

public record DiarySummaryResponse(
    Long id,
    String title,
    LocalDate diaryDate,
    LocalDateTime createdAt
) {
    public static DiarySummaryResponse from(Diary diary) {
        return new DiarySummaryResponse(
            diary.getId(),
            diary.getTitle(),
            diary.getDiaryDate(),
            diary.getCreatedAt()
        );
    }
}

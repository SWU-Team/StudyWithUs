package com.swu.diary.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.swu.diary.domain.Diary;

public record DiaryResponse(
    Long id,
    String title,
    String content,
    LocalDate diaryDate,
    LocalDateTime createdAt,
    String feedback
) {
    public static DiaryResponse from(Diary diary) {
        return new DiaryResponse(
            diary.getId(),
            diary.getTitle(),
            diary.getContent(),
            diary.getDiaryDate(),
            diary.getCreatedAt(),
            diary.getFeedback()
        );
    }
}

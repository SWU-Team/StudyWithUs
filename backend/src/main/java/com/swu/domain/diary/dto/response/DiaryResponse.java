package com.swu.domain.diary.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.swu.domain.diary.entity.Diary;

public record DiaryResponse(
    Long id,
    String title,
    String content,
    int score,
    LocalDate diaryDate,
    LocalDateTime createdAt,
    String feedback,
    int studyMinutes
) {
    public static DiaryResponse from(Diary diary, int studyMinutes) {
        return new DiaryResponse(
            diary.getId(),
            diary.getTitle(),
            diary.getContent(),
            diary.getScore(),
            diary.getDiaryDate(),
            diary.getCreatedAt(),
            diary.getFeedback(),
            studyMinutes
        );
    }
}

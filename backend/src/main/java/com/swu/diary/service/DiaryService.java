package com.swu.diary.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swu.diary.domain.Diary;
import com.swu.diary.dto.request.DiaryRequest;
import com.swu.diary.dto.response.DiaryResponse;
import com.swu.diary.dto.response.DiarySummaryResponse;
import com.swu.diary.exception.DiaryAlreadyExistsException;
import com.swu.diary.exception.DiaryNotFoundException;
import com.swu.diary.repository.DiaryRepository;
import com.swu.user.domain.User;
import com.swu.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;

    @Transactional
    public void createDiary(Long userId, DiaryRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalStateException("인증된 유저가 DB에 존재하지 않음"));

        boolean isExist = diaryRepository.existsByUserIdAndDiaryDate(userId, request.diaryDate());
        
        if (isExist) {
            throw new DiaryAlreadyExistsException();
        }

        String dummyFeedBack = "오늘 하루 힘든 일이 있었지만, 그래도 회고를 쓴 당신은 멋집니다.";

        Diary diary = Diary.builder()
            .user(user)
            .title(request.title())
            .content(request.content())
            .diaryDate(request.diaryDate())
            .feedback(dummyFeedBack)
            .build();

        diaryRepository.save(diary);
    }

    @Transactional(readOnly = true)
    public DiaryResponse getDiary(Long id, Long userId) {
        Diary diary = diaryRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new DiaryNotFoundException());

        return DiaryResponse.from(diary);
    }

    @Transactional(readOnly = true)
    public List<DiarySummaryResponse> getDiaries(Long userId, YearMonth month) {
        List<Diary> diaries;

        if (month != null) {
            LocalDate start = month.atDay(1);
            LocalDate end = month.atEndOfMonth();
            diaries = diaryRepository.findByUserIdAndDiaryDateBetweenOrderByDiaryDateDesc(userId, start, end);
        } else {
            diaries = diaryRepository.findByUserIdOrderByDiaryDateDesc(userId);
        }

        return diaries.stream()
            .map(DiarySummaryResponse::from)
            .toList();
    }
}

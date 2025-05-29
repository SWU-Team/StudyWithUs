package com.swu.domain.diary.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swu.domain.diary.dto.request.DiaryRequest;
import com.swu.domain.diary.dto.response.DiaryResponse;
import com.swu.domain.diary.entity.Diary;
import com.swu.domain.diary.exception.DiaryAlreadyExistsException;
import com.swu.domain.diary.exception.DiaryNotFoundException;
import com.swu.domain.diary.repository.DiaryRepository;
import com.swu.domain.studytime.entity.StudyTime;
import com.swu.domain.studytime.repository.StudyTimeRepository;
import com.swu.domain.user.entity.User;
import com.swu.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class DiaryService {

    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;
    private final StudyTimeRepository studyTimeRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public DiaryResponse createDiary(Long userId, DiaryRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalStateException("인증된 유저가 DB에 존재하지 않음"));

        boolean isExist = diaryRepository.existsByUserIdAndDiaryDate(userId, request.diaryDate());
        if (isExist) {
            throw new DiaryAlreadyExistsException();
        }

        String feedback = getFeedbackFromFastAPI(request.content());

        Diary diary = Diary.builder()
            .user(user)
            .title(request.title())
            .content(request.content())
            .score(request.score())
            .diaryDate(request.diaryDate())
            .feedback(feedback)
            .build();

        diaryRepository.save(diary);
        return DiaryResponse.from(diary, 0);
    }

    private String getFeedbackFromFastAPI(String content) {
        try {
            log.info("FastAPI 요청 시작: " + content);

            String url = "http://studyfastapi.kro.kr:8081/predict";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String json = new ObjectMapper().writeValueAsString(Map.of("text", content));
            HttpEntity<String> request = new HttpEntity<>(json, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            log.info("FastAPI 응답: " + response);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody().get("response").toString();
            } else {
                return "AI 피드백 생성에 실패했습니다.";
            }
        } catch (Exception e) {
            log.info("FastAPI 호출 중 예외 발생:");
            e.printStackTrace();
            return "AI 피드백 처리 중 오류가 발생했습니다.";
        }
    }

    @Transactional(readOnly = true)
    public DiaryResponse getDiary(Long id, Long userId) {
        Diary diary = diaryRepository.findByIdAndUserId(id, userId)
            .orElseThrow(DiaryNotFoundException::new);

        int studyMinutes = studyTimeRepository
            .findByUserIdAndRecordDate(userId, diary.getDiaryDate())
            .map(StudyTime::getTotalMinutes)
            .orElse(0);

        return DiaryResponse.from(diary, studyMinutes);
    }

    @Transactional(readOnly = true)
    public List<DiaryResponse> getDiaries(Long userId, YearMonth month) {
        List<Diary> diaries;

        if (month != null) {
            LocalDate start = month.atDay(1);
            LocalDate end = month.atEndOfMonth();
            diaries = diaryRepository.findByUserIdAndDiaryDateBetweenOrderByDiaryDateDesc(userId, start, end);
        } else {
            diaries = diaryRepository.findByUserIdOrderByDiaryDateDesc(userId);
        }

        return diaries.stream()
            .map(diary -> {
                int minutes = studyTimeRepository.findByUserIdAndRecordDate(userId, diary.getDiaryDate())
                    .map(StudyTime::getTotalMinutes)
                    .orElse(0);
                return DiaryResponse.from(diary, minutes);
            })
            .toList();
    }
}

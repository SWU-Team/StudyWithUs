package com.swu.domain.studytime.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.swu.domain.studytime.dto.response.StudyTimeResponse;
import com.swu.domain.studytime.entity.StudyTime;
import com.swu.domain.studytime.repository.StudyTimeRepository;
import com.swu.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudyTimeService {

    private final StudyTimeRepository studyTimeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public StudyTimeResponse getStudyTime(Long userId, LocalDate date) {

        StudyTime studyTime = studyTimeRepository.findByUserIdAndRecordDate(userId, date)
            .orElse(null);

        if (studyTime != null) {
            return new StudyTimeResponse(studyTime.getRecordDate(), studyTime.getTotalMinutes());
        } else {
            return new StudyTimeResponse(date, 0);
        }
    }

    @Transactional(readOnly = true)
    public List<StudyTimeResponse> getStudyTimes(Long userId, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();

        List<StudyTime> studyTimes = studyTimeRepository.findByUserIdAndRecordDateBetween(userId, start, end);

        return studyTimes.stream()
            .map(st -> new StudyTimeResponse(st.getRecordDate(), st.getTotalMinutes()))
            .toList();
    }

    @Transactional
    public void addOrUpdate(Long userId, LocalDate date, int minutes) {
        StudyTime studyTime = studyTimeRepository.findByUserIdAndRecordDate(userId, date)
            .orElseGet(() -> StudyTime.builder()
                .user(userRepository.getReferenceById(userId))
                .recordDate(date)
                .totalMinutes(0)
                .build());

        studyTime.addMinutes(minutes); // 누적
        studyTimeRepository.save(studyTime);
    }

    @Transactional(readOnly = true)
    public int getTotalStudyMinutes(Long userId) {
        return studyTimeRepository.getTotalMinutesByUserId(userId);
    }
}
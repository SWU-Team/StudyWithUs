package com.swu.controller;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swu.auth.entity.PrincipalDetails;
import com.swu.domain.studytime.dto.response.StudyTimeResponse;
import com.swu.domain.studytime.service.StudyTimeService;
import com.swu.global.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/study-times")
@RequiredArgsConstructor
@Tag(name = "Study_Time", description = "날짜별 / 월별 스터디 시간 조회 API")
public class StudyTimeController {

    private final StudyTimeService studyTimeService;

    @GetMapping
    @Operation(summary = "스터디 시간 단일 조회", description = "특정 날짜의 스터디 시간을 조회합니다.")
    public ResponseEntity<ApiResponse<StudyTimeResponse>> getStudyTime(
        @RequestParam LocalDate date,
        @AuthenticationPrincipal PrincipalDetails userDetails) {
        
        Long userId = userDetails.getUser().getId();
        StudyTimeResponse response = studyTimeService.getStudyTime(userId, date);

        return ResponseEntity.ok(
            ApiResponse.success("스터디 시간 조회 성공", response)
        );
    }

    @GetMapping("/monthly")
    @Operation(summary = "월간 스터디 시간 조회", description = "특정 월의 스터디 시간을 일자별로 조회합니다.")
    public ResponseEntity<ApiResponse<List<StudyTimeResponse>>> getMonthlyStudyTimes(
        @RequestParam YearMonth month,
        @AuthenticationPrincipal PrincipalDetails userDetails) {
            
        Long userId = userDetails.getUser().getId();
        List<StudyTimeResponse> response = studyTimeService.getStudyTimes(userId, month);

        return ResponseEntity.ok(ApiResponse.success("월간 스터디 시간 목록 조회 성공", response));
    }
}

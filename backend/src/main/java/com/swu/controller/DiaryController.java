package com.swu.controller;

import java.time.YearMonth;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swu.auth.entity.CustomUserDetails;
import com.swu.domain.diary.dto.request.DiaryRequest;
import com.swu.domain.diary.dto.response.DiaryResponse;
import com.swu.domain.diary.service.DiaryService;
import com.swu.global.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
@Tag(name = "Diary", description = "일기 관련 API")
public class DiaryController {

    private final DiaryService diaryService;

    @PostMapping
    @Operation(summary = "일기 생성", description = "일기를 새로 생성합니다.")
    public ResponseEntity<ApiResponse<DiaryResponse>> createDiary(
        @RequestBody @Valid DiaryRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails) {

        DiaryResponse response = diaryService.createDiary(userDetails.getUser().getId(), request);
        return ResponseEntity.ok(ApiResponse.success("일기 생성 성공", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "일기 단건 조회", description = "id를 이용해 사용자의 일기를 조회합니다.")
    public ResponseEntity<ApiResponse<DiaryResponse>> getDiary(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails) {

        DiaryResponse response = diaryService.getDiary(id, userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("일기 조회 성공", response));
    }

    @GetMapping
    @Operation(summary = "일기 목록 조회", description = "선택된 월에 해당하는 사용자의 일기 목록을 조회합니다. 월을 지정하지 않으면 전체 조회됩니다.")
    public ResponseEntity<ApiResponse<List<DiaryResponse>>> getDiaries(
        @RequestParam(required = false)
        @DateTimeFormat(pattern = "yyyy-MM") YearMonth month,
        @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<DiaryResponse> response = diaryService.getDiaries(userDetails.getUser().getId(), month);
        return ResponseEntity.ok(ApiResponse.success("일기 목록 조회 성공", response));
    }
}

package com.swu.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swu.auth.entity.PrincipalDetails;
import com.swu.domain.plan.dto.PlanRequest;
import com.swu.domain.plan.dto.PlanResponse;
import com.swu.domain.plan.service.PlanService;
import com.swu.global.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@Tag(name = "Plan", description = "플래너(투두리스트) 관련 API")
public class PlanController {
    
    private final PlanService planService;

    @Operation(summary = "플랜 생성", description = "사용자의 새로운 할 일을 생성합니다.")
    @PostMapping
    public ResponseEntity<ApiResponse<PlanResponse>> createPlan(
            @RequestBody @Valid PlanRequest request,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        PlanResponse response = planService.createPlan(request, userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("플랜 생성 성공", response));
    }

    @Operation(summary = "플랜 조회", description = "요청한 날짜 기준으로 사용자의 할 일을 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<PlanResponse>>> getPlansByDate(
            @RequestParam LocalDate date,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        List<PlanResponse> responses = planService.getPlansByDate(date, userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("플랜 조회 성공", responses));
    }

    @Operation(summary = "월별 플랜 조회", description = "요청한 연도/월 기준으로 사용자의 할 일을 조회합니다.")
    @GetMapping("/month")
    public ResponseEntity<ApiResponse<List<PlanResponse>>> getPlansByMonth(
            @RequestParam int year,
            @RequestParam int month,
            @AuthenticationPrincipal PrincipalDetails userDetails) {

        List<PlanResponse> responses = planService.getPlansByMonth(year, month, userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("월별 플랜 조회 성공", responses));
    }

    @Operation(summary = "특정 플랜 수정", description = "특정 플랜을 수정합니다.")
    @PatchMapping("/{planId}")
    public ResponseEntity<ApiResponse<PlanResponse>> updatePlan(
            @PathVariable Long planId,
            @RequestBody @Valid PlanRequest request,
            @AuthenticationPrincipal PrincipalDetails userDetails) {

        PlanResponse response = planService.updatePlan(planId, request, userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("플랜 수정 성공", response));
        }

    @Operation(summary = "플랜 삭제", description = "사용자의 플랜을 삭제합니다.")
    @DeleteMapping("/{planId}")
    public ResponseEntity<ApiResponse<Void>> deletePlan(
            @PathVariable Long planId,
            @AuthenticationPrincipal PrincipalDetails userDetails) {
        planService.deletePlan(planId, userDetails.getUser().getId());
        return ResponseEntity.ok(ApiResponse.success("플랜 삭제 성공", null));
    }   
}

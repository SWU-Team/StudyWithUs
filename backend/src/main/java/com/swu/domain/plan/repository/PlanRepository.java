package com.swu.domain.plan.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swu.domain.plan.entity.Plan;

public interface PlanRepository extends JpaRepository<Plan, Long> {

    // 특정 사용자, 특정 날짜 기준 정렬 (우선순위 기준)
    List<Plan> findByUserIdAndPlanDateOrderByPriorityDesc(Long userId, LocalDate planDate);

    // 특정 사용자, 특정 날짜 범위 기준 정렬
    List<Plan> findByUserIdAndPlanDateBetweenOrderByPlanDateAsc(Long userId, LocalDate start, LocalDate end);

    // 특정 사용자 소유의 Plan 단건 조회 (권한 보호)
    Optional<Plan> findByIdAndUserId(Long planId, Long userId);

    // 필요 시: 전체 Plan 날짜별 정렬 (사용자 전용)
    List<Plan> findByUserIdOrderByPlanDateDesc(Long userId);
}

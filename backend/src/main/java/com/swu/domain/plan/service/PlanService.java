package com.swu.domain.plan.service;

import com.swu.domain.plan.dto.PlanRequest;
import com.swu.domain.plan.dto.PlanResponse;
import com.swu.domain.plan.dto.PlanStatsResponse;
import com.swu.domain.plan.entity.Plan;
import com.swu.domain.plan.repository.PlanRepository;
import com.swu.domain.plan.exception.PlanNotFoundException;
import com.swu.domain.user.entity.User;
import com.swu.domain.user.exception.UserNotFoundException;
import com.swu.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;
    private final UserRepository userRepository;

    @Transactional
    public PlanResponse createPlan(PlanRequest request, Long userId) {
        log.info("유저 ID {}의 플랜 생성 요청: {}", userId, request);
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        Plan plan = Plan.builder()
                .user(user)
                .content(request.content())
                .planDate(request.planDate())
                .priority(request.priority())
                .isCompleted(false)
                .build();

        planRepository.save(plan);
        return PlanResponse.from(plan);
    }

    @Transactional(readOnly = true)
    public List<PlanResponse> getPlansByDate(LocalDate date, Long userId) {
        log.debug("유저 ID {}의 {} 날짜 플랜 조회", userId, date);
        List<Plan> plans = planRepository.findByUserIdAndPlanDateOrderByPriorityDesc(userId, date);
        return plans.stream()
                .map(PlanResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PlanResponse> getPlansByMonth(int year, int month, Long userId) {
        log.debug("유저 ID {}의 {}년 {}월 플랜 조회", userId, year, month);
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Plan> plans = planRepository.findByUserIdAndPlanDateBetweenOrderByPlanDateAsc(userId, start, end);
        return plans.stream()
                .map(PlanResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PlanStatsResponse getPlanStats(Long userId) {
        log.debug("유저 ID 플랜Stats 조회", userId);
        List<Plan> plans = planRepository.findByUserId(userId);
        int total = plans.size();
        int completed = (int) plans.stream().filter(Plan::isCompleted).count();
        return new PlanStatsResponse(total, completed);
    }
    

    @Transactional
    public PlanResponse updatePlan(Long planId, PlanRequest request, Long userId) {
        log.info("플랜 수정 요청: planId={}, userId={}", planId, userId);
        Plan plan = planRepository.findByIdAndUserId(planId, userId)
                .orElseThrow(PlanNotFoundException::new);

        plan.update(
            request.content(),
            request.planDate(),
            request.priority(),
            request.isCompleted()
        );
        return PlanResponse.from(plan);
    }

    @Transactional
    public void deletePlan(Long planId, Long userId) {
        log.info("플랜 삭제 요청: planId={}, userId={}", planId, userId);
        Plan plan = planRepository.findByIdAndUserId(planId, userId)
                .orElseThrow(PlanNotFoundException::new);
        planRepository.delete(plan);
    }
}

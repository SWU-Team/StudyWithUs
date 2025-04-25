package com.swu.domain.plan.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swu.domain.plan.entity.Plan;

public interface PlanRepository extends JpaRepository<Plan, Long> {
}

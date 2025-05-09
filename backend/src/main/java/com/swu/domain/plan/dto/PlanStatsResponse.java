package com.swu.domain.plan.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlanStatsResponse {
    private int totalPlans;
    private int completedPlans;
}


package com.swu.domain.studytime.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.swu.domain.studytime.entity.StudyTime;

public interface StudyTimeRepository extends JpaRepository<StudyTime, Long> {
}

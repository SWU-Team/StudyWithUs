package com.swu.domain.studytime.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.swu.domain.studytime.entity.StudyTime;

import io.lettuce.core.dynamic.annotation.Param;

public interface StudyTimeRepository extends JpaRepository<StudyTime, Long> {
    Optional<StudyTime> findByUserIdAndRecordDate(Long userId, LocalDate date);
    List<StudyTime> findByUserIdAndRecordDateBetween(Long userId, LocalDate start, LocalDate end);
    
    @Query("SELECT COALESCE(SUM(s.totalMinutes), 0) FROM StudyTime s WHERE s.user.id = :userId")
    int getTotalMinutesByUserId(@Param("userId") Long userId);
}   

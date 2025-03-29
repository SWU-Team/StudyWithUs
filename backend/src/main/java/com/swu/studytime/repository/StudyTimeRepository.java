package com.swu.studytime.repository;

import com.swu.studytime.domain.StudyTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyTimeRepository extends JpaRepository<StudyTime, Long> {
}

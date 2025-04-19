package com.swu.diary.repository;

import com.swu.diary.domain.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    boolean existsByUserIdAndDiaryDate(Long userId, LocalDate diaryDate);
    Optional<Diary> findByIdAndUserId(Long id, Long userId);
    List<Diary> findByUserIdOrderByDiaryDateDesc(Long userId);
    List<Diary> findByUserIdAndDiaryDateBetweenOrderByDiaryDateDesc(Long userId, LocalDate start, LocalDate end);
}

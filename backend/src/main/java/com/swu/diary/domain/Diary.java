package com.swu.diary.domain;

import com.swu.user.domain.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "diary",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "diary_date"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 하루에 한 번 작성
    @Column(name = "diary_date", nullable = false)
    private LocalDate diaryDate;

    // 생성 시점 자동 저장
    @CreationTimestamp
    private LocalDateTime createdAt;

    // 챗봇 피드백 (선택사항)
    @Lob
    private String feedback;
}

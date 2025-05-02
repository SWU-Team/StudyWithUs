package com.swu.domain.diary.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.swu.domain.user.entity.User;

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

    @Column(nullable = false)
    private int score;

    @Column(name = "diary_date", nullable = false)
    private LocalDate diaryDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Lob
    private String feedback;
}

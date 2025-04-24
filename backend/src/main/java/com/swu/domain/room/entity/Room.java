package com.swu.domain.room.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false)
    private int maxCapacity;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int focusMinute;

    @Column(nullable = false)
    private int breakMinute;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bgm_id")
    private Bgm bgm;

    @Column(nullable = false)
    @Builder.Default
    private boolean isDeleted = false;

    public void setDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}

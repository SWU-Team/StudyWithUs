package com.swu.domain.room.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.swu.domain.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    private LocalDateTime joinedAt;

    // null = 현재 방에 있는 중
    private LocalDateTime exitedAt;

    private boolean isHost;

    void setRoom(Room room) {
        this.room = room;
    }

    public void exit() {
        this.exitedAt = LocalDateTime.now();
    }

    public void setHost(boolean isHost) {
        this.isHost = isHost;
    }
}

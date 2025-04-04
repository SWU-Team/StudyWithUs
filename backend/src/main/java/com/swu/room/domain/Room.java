package com.swu.room.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomMember> members = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bgm_id")
    private Bgm bgm;

    public void addMember(RoomMember member) {
        members.add(member);
        member.setRoom(this);
    }
}

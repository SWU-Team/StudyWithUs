package com.swu.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = true, length = 255)
    private String password;

    @Column(nullable = false, length = 30)
    private String nickname;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LoginType loginType = LoginType.LOCAL;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Grade grade = Grade.BRONZE;

    @Column(nullable = true, length = 255)
    private String profileImg;

    @CreationTimestamp
    private Timestamp createdAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean isDeleted = false;

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateProfileImg(String profileImg) {
        this.profileImg = profileImg;
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void withdraw() {
        this.isDeleted = true;
        this.email = "deleted_" + UUID.randomUUID() + "@deleted.com";
        this.password = null;
        this.nickname = "탈퇴한 사용자";
        this.profileImg = null;
    }

    public void updateRole(Role role) {
        this.role = role;
    }
}

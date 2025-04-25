package com.swu.domain.user.dto.response;

import com.swu.domain.user.entity.Grade;
import com.swu.domain.user.entity.LoginType;
import com.swu.domain.user.entity.Role;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserInfoResponse {
    private Long id;
    private String email;
    private String nickname;
    private Role role;
    private LoginType loginType;
    private Grade grade;
    private String profileImg;
    private String createdAt;
} 
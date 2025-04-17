package com.swu.user.dto.response;

import com.swu.user.domain.Grade;
import com.swu.user.domain.LoginType;
import com.swu.user.domain.Role;
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
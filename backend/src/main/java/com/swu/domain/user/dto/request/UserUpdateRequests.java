package com.swu.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class UserUpdateRequests {
    
    @Getter
    @NoArgsConstructor
    public static class Nickname {
        @NotBlank(message = "닉네임은 필수 입력 항목입니다.")
        private String nickname;
    }

    @Getter
    @NoArgsConstructor
    public static class ProfileImg {
        @NotBlank(message = "프로필 이미지는 필수 입력 항목입니다.")
        private String profileImg;
    }
}

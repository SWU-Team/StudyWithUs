package com.swu.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ExtraInfoRequest {
    @NotBlank
    private String nickname;
}

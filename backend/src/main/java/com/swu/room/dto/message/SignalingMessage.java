package com.swu.room.dto.message;

import java.util.Set;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "WebRTC 시그널링 메시지 DTO")
public record SignalingMessage(
    @NotBlank(message = "메시지 타입은 필수입니다.")
    String type,
    
    @NotNull(message = "방 ID는 필수입니다.")
    @Positive(message = "방 ID는 양수여야 합니다.")
    Long roomId,
    
    @NotNull(message = "발신자 ID는 필수입니다.")
    @Positive(message = "발신자 ID는 양수여야 합니다.")
    Long senderId,
    
    @NotBlank(message = "발신자 닉네임은 필수입니다.")
    String senderNickname,
    
    @NotNull(message = "데이터는 필수입니다.")
    Object data
) {
    private static final Set<String> VALID_TYPES = Set.of("offer", "answer", "ice", "join", "leave","error");
    
    public SignalingMessage {
        if (!VALID_TYPES.contains(type)) {
            throw new IllegalArgumentException("잘못된 메시지 타입입니다. : " + type);
        }
    }
    
    public static SignalingMessage createError(Long roomId, Long senderId, String senderNickname, String errorMessage) {
        return new SignalingMessage("error", roomId, senderId, senderNickname, errorMessage);
    }
} 
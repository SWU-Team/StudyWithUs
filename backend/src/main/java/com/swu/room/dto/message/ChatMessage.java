package com.swu.room.dto.message;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "채팅 메시지 DTO")
public record ChatMessage(

    @NotNull(message = "메시지 타입은 필수입니다.")
    MessageType type,

    @NotNull(message = "방 ID는 필수입니다.")
    @Positive(message = "방 ID는 양수여야 합니다.")
    Long roomId,

    @NotNull(message = "발신자 ID는 필수입니다.")
    @Positive(message = "발신자 ID는 양수여야 합니다.")
    Long senderId,

    @NotBlank(message = "발신자 닉네임은 필수입니다.")
    String senderNickname,

    @NotBlank(message = "메시지 내용은 필수입니다.")
    String message

) {
    public enum MessageType {
        ENTER, TALK, EXIT
    }
}

package com.swu.room.dto.message;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    public enum MessageType {
        ENTER, // 입장
        TALK,  // 채팅
        EXIT   // 퇴장
    }

    private MessageType type;
    private Long roomId;
    private Long senderId;
    private String senderNickname;
    private String message;

    @Override
    public String toString() {
        return "ChatMessage{" +
                "type=" + type +
                ", roomId=" + roomId +
                ", senderId=" + senderId +
                ", senderNickname='" + senderNickname + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
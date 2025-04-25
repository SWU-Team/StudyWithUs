package com.swu.global.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

    private int code;      // 0 = 성공, 1이 이상 = 실패
    private String message;  // 응답 메시지
    private T data;          // 응답 데이터

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, "성공", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(0, message, data);
    }

    public static <T> ApiResponse<T> failure(String message) {
        return new ApiResponse<>(1, message, null);
    }

    public static <T> ApiResponse<T> failure(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}

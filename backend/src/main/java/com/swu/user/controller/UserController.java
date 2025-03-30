package com.swu.user.controller;

import com.swu.global.response.ApiResponse;
import com.swu.user.dto.request.SignupRequest;
import com.swu.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/auth/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@RequestBody @Valid SignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok(ApiResponse.ok("회원가입 성공", null));
    }
}

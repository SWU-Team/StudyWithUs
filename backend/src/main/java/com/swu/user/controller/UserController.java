package com.swu.user.controller;

import com.swu.auth.domain.CustomUserDetails;
import com.swu.global.response.ApiResponse;
import com.swu.user.domain.User;
import com.swu.user.dto.request.PasswordChangeRequest;
import com.swu.user.dto.request.SignupRequest;
import com.swu.user.dto.request.UserUpdateRequests;
import com.swu.user.dto.response.UserInfoResponse;
import com.swu.user.exception.ImageUploadFailedException;
import com.swu.user.service.UserService;
import com.swu.user.util.S3Uploader;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final S3Uploader s3Uploader; 

    @Operation(summary = "회원가입", description = "이메일, 비밀번호, 닉네임을 통해 회원가입을 수행합니다.")
    @PostMapping("/auth/signup")
    public ResponseEntity<ApiResponse<Void>> signup(
        @RequestPart("user") @Valid SignupRequest request,
        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        String profileImgUrl = null;

        try {
            profileImgUrl = s3Uploader.upload(profileImage);
            request.setProfileImg(profileImgUrl);
        } catch (IOException e) {
            throw new ImageUploadFailedException("이미지 업로드 중 오류 발생");
        }
        
        userService.signup(request);
        return ResponseEntity.ok(ApiResponse.ok("회원가입 성공", null));
    }

    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        UserInfoResponse response = userService.getUserInfo(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("내 정보 조회 성공", response));
    }

    @Operation(summary = "닉네임 수정", description = "현재 로그인한 사용자의 닉네임을 수정합니다.")
    @PatchMapping("/users/me/nickname")
    public ResponseEntity<ApiResponse<Void>> updateNickname(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid UserUpdateRequests.Nickname request) {
        User user = userDetails.getUser();
        userService.updateNickname(user.getId(), request.getNickname());
        return ResponseEntity.ok(ApiResponse.ok("닉네임 변경 성공", null));
    }

    
    @Operation(summary = "프로필 이미지 수정", description = "현재 로그인한 사용자의 프로필을 수정합니다.")
    @PatchMapping("/users/me/profileImg")
    public ResponseEntity<ApiResponse<Void>> updateProfileImg(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart(value = "profileImage") MultipartFile profileImage) {
        
        try {
            String uploadedUrl = s3Uploader.upload(profileImage);
            userService.updateProfileImg(userDetails.getUser().getId(), uploadedUrl);
        } catch (IOException e) {
            throw new ImageUploadFailedException("이미지 업로드 중 오류 발생");
        }

        return ResponseEntity.ok(ApiResponse.ok("프로필 이미지 변경 성공", null));
    }

    
    @Operation(summary = "비밀번호 변경", description = "현재 로그인한 사용자의 비밀번호를 변경합니다.")
    @PatchMapping("/users/me/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid PasswordChangeRequest request) {
        User user = userDetails.getUser();
        userService.updatePassword(user.getId(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.ok("비밀번호 변경 성공", null));
    }

    @Operation(summary = "회원 탈퇴", description = "현재 로그인한 사용자의 계정을 삭제합니다.")
    @DeleteMapping("/users/me")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        userService.deleteUser(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("회원 탈퇴 성공", null));
    }
}

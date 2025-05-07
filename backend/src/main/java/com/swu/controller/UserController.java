package com.swu.controller;

import com.swu.auth.entity.CustomUserDetails;
import com.swu.domain.user.dto.request.ExtraInfoRequest;
import com.swu.domain.user.dto.request.PasswordChangeRequest;
import com.swu.domain.user.dto.request.SignupRequest;
import com.swu.domain.user.dto.request.UserUpdateRequests;
import com.swu.domain.user.dto.response.UserInfoResponse;
import com.swu.domain.user.entity.User;
import com.swu.domain.user.exception.ImageUploadFailedException;
import com.swu.domain.user.service.UserService;
import com.swu.global.response.ApiResponse;
import com.swu.util.S3Uploader;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "User", description = "사용자 관련 API")
public class UserController {

    private final UserService userService;
    private final S3Uploader s3Uploader; 

    @Operation(summary = "회원가입", description = "이메일, 비밀번호, 닉네임을 통해 회원가입을 수행합니다.")
    @PostMapping("/auth/signup")
    public ResponseEntity<ApiResponse<Void>> signup(
        @RequestPart("user") @Valid SignupRequest request,
        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        String profileImgUrl = null;
        
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                profileImgUrl = s3Uploader.upload(profileImage);
                request.setProfileImg(profileImgUrl);
            } catch (IOException e) {
                throw new ImageUploadFailedException("이미지 업로드 중 오류 발생");
            }
        }
        
        userService.signup(request);
        return ResponseEntity.ok(ApiResponse.success("회원가입 성공", null));
    }

    @Operation(summary = "소셜 로그인 유저 추가 정보 입력", description = "닉네임, 프로필 이미지를 입력하여 PREUSER → USER 승격")
    @PostMapping("/users/complete-info")
    public ResponseEntity<ApiResponse<Void>> completeInfo(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestPart("info") @Valid ExtraInfoRequest request,
        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        String profileUrl = null;

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                profileUrl = s3Uploader.upload(profileImage);
            } catch (IOException e) {
                throw new ImageUploadFailedException("이미지 업로드 실패");
            }
        }

        userService.completeExtraInfo(userDetails.getUser().getId(), request.getNickname(), profileUrl);

        return ResponseEntity.ok(ApiResponse.success("추가 정보 입력 완료", null));
    }


    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        UserInfoResponse response = userService.getUserInfo(user.getId());
        return ResponseEntity.ok(ApiResponse.success("내 정보 조회 성공", response));
    }

    @Operation(summary = "닉네임 수정", description = "현재 로그인한 사용자의 닉네임을 수정합니다.")
    @PatchMapping("/users/me/nickname")
    public ResponseEntity<ApiResponse<Void>> updateNickname(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid UserUpdateRequests.Nickname request) {
        User user = userDetails.getUser();
        userService.updateNickname(user.getId(), request.getNickname());
        return ResponseEntity.ok(ApiResponse.success("닉네임 변경 성공", null));
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

        return ResponseEntity.ok(ApiResponse.success("프로필 이미지 변경 성공", null));
    }

    @Operation(summary = "비밀번호 변경", description = "현재 로그인한 사용자의 비밀번호를 변경합니다.")
    @PatchMapping("/users/me/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid PasswordChangeRequest request) {
        User user = userDetails.getUser();
        userService.updatePassword(user.getId(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("비밀번호 변경 성공", null));
    }

    @Operation(summary = "회원 탈퇴", description = "현재 로그인한 사용자의 계정을 삭제합니다.")
    @DeleteMapping("/users/me")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        userService.deleteUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success("회원 탈퇴 성공", null));
    }
}

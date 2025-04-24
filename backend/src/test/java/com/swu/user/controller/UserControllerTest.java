package com.swu.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swu.controller.UserController;
import com.swu.domain.user.dto.request.PasswordChangeRequest;
import com.swu.domain.user.dto.request.SignupRequest;
import com.swu.domain.user.dto.request.UserUpdateRequests;
import com.swu.domain.user.dto.response.UserInfoResponse;
import com.swu.domain.user.entity.Grade;
import com.swu.domain.user.entity.LoginType;
import com.swu.domain.user.entity.Role;
import com.swu.domain.user.service.UserService;
import com.swu.testconfig.TestSecurityConfig;
import com.swu.testconfig.WithMockCustomUser;
import com.swu.util.S3Uploader;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(TestSecurityConfig.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private S3Uploader s3Uploader;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("회원가입 - 정상 케이스")
    void signup_정상케이스() throws Exception {
        // given
        SignupRequest request = new SignupRequest("test@example.com", "1234", "닉네임", null);

        MockMultipartFile userPart = new MockMultipartFile("user", "", "application/json",
                objectMapper.writeValueAsBytes(request));

        MockMultipartFile imagePart = new MockMultipartFile("profileImage", "image.jpg", "image/jpeg",
                "이미지바이트".getBytes());

        given(s3Uploader.upload(any())).willReturn("https://dummy.com/profile.jpg");

        // when & then
        mockMvc.perform(multipart("/api/auth/signup")
                .file(userPart)
                .file(imagePart)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("회원가입 성공"));
    }

    @Test
    @WithMockCustomUser
    @DisplayName("내 정보 조회 - 정상 케이스")
    void getMyInfo_정상케이스() throws Exception {
        // given
        UserInfoResponse response = UserInfoResponse.builder()
                .id(1L)
                .email("test@example.com")
                .nickname("닉네임")
                .role(Role.USER)
                .loginType(LoginType.LOCAL)
                .grade(Grade.BRONZE)
                .profileImg(null)
                .createdAt("2024-01-01 00:00:00")
                .build();

        given(userService.getUserInfo(1L)).willReturn(response);

        // when & then
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("내 정보 조회 성공"))
                .andExpect(jsonPath("$.data.email").value("test@example.com"));
    }

    @Test
    @WithMockCustomUser
    @DisplayName("닉네임 변경 - 정상 케이스")
    void updateNickname_정상케이스() throws Exception {
        // given
        UserUpdateRequests.Nickname request = new UserUpdateRequests.Nickname();
        ReflectionTestUtils.setField(request, "nickname", "새닉네임");

        // when & then
        mockMvc.perform(patch("/api/users/me/nickname")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("닉네임 변경 성공"));
    }

    @Test
    @WithMockCustomUser
    @DisplayName("프로필 이미지 변경 - 정상 케이스")
    void updateProfileImg_정상케이스() throws Exception {
        // given
        MockMultipartFile imagePart = new MockMultipartFile("profileImage", "profile.jpg", "image/jpeg",
                "바이트데이터".getBytes());
        given(s3Uploader.upload(any())).willReturn("https://dummy.com/new-profile.jpg");

        // when & then
        mockMvc.perform(multipart("/api/users/me/profileImg")
                .file(imagePart)
                .with(request -> {
                    request.setMethod("PATCH");
                    return request;
                }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("프로필 이미지 변경 성공"));
    }

    @Test
    @WithMockCustomUser
    @DisplayName("비밀번호 변경 - 정상 케이스")
    void updatePassword_정상케이스() throws Exception {
        // given
        PasswordChangeRequest request = new PasswordChangeRequest();
        ReflectionTestUtils.setField(request, "currentPassword", "1234");
        ReflectionTestUtils.setField(request, "newPassword", "abcd");

        // when & then
        mockMvc.perform(patch("/api/users/me/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("비밀번호 변경 성공"));
    }
}

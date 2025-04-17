package com.swu.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swu.testconfig.TestSecurityConfig;
import com.swu.testconfig.WithMockCustomUser;
import com.swu.user.domain.Grade;
import com.swu.user.domain.LoginType;
import com.swu.user.domain.Role;
import com.swu.user.dto.request.PasswordChangeRequest;
import com.swu.user.dto.request.SignupRequest;
import com.swu.user.dto.request.UserUpdateRequests;
import com.swu.user.dto.response.UserInfoResponse;
import com.swu.user.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(UserController.class)
@Import(TestSecurityConfig.class)
public class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("회원가입 - 정상 케이스")
    void signup_정상케이스() throws Exception {
        SignupRequest request = new SignupRequest("test@example.com", "1234", "닉네임", null);

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
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

        when(userService.getUserInfo(1L)).thenReturn(response);

        // when & then
        mockMvc.perform(get("/users/me"))
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
        mockMvc.perform(patch("/users/me/nickname")
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
        UserUpdateRequests.ProfileImg request = new UserUpdateRequests.ProfileImg();
        ReflectionTestUtils.setField(request, "profileImg", "https://image.com/profile.jpg");

        // when & then
        mockMvc.perform(patch("/users/me/profileImg")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
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
        mockMvc.perform(patch("/users/me/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("비밀번호 변경 성공"));
    }
}

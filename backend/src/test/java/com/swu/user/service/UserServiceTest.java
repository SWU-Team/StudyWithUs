package com.swu.user.service;

import com.swu.user.domain.*;
import com.swu.user.dto.request.SignupRequest;
import com.swu.user.dto.response.UserInfoResponse;
import com.swu.user.exception.*;
import com.swu.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .nickname("닉네임")
                .role(Role.USER)
                .loginType(LoginType.LOCAL)
                .grade(Grade.BRONZE)
                .isDeleted(false)
                .createdAt(Timestamp.valueOf("2024-01-01 00:00:00")) 
                .build();
    }

    @Test
    @DisplayName("회원가입 - 정상 케이스")
    void signup_정상적으로_회원가입된다() {
        // given
        SignupRequest request = new SignupRequest("test@example.com", "rawPassword", "닉네임", null);
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");

        // when
        userService.signup(request);

        // then
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("회원가입 - 이메일 중복")
    void signup_이메일중복이면_예외발생() {
        // given
        SignupRequest request = new SignupRequest("test@example.com", "rawPassword", "닉네임", null);
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // when & then
        assertThrows(EmailAlreadyExistsException.class, () -> userService.signup(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("내 정보 조회 - 정상 케이스")
    void getUserInfo_정상조회() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // when
        UserInfoResponse response = userService.getUserInfo(1L);
        
        // then
        assertEquals("test@example.com", response.getEmail());
    }

    @Test
    @DisplayName("내 정보 조회 - 유저 없음")
    void getUserInfo_없는유저는_예외발생() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThrows(UserNotFoundException.class, () -> userService.getUserInfo(1L));
    }

    @Test
    @DisplayName("닉네임 수정 - 정상")
    void updateNickname_정상수정() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // when
        userService.updateNickname(1L, "새닉네임");

        // then
        assertEquals("새닉네임", user.getNickname());
    }

    @Test
    @DisplayName("닉네임 수정 - 유저 없음")
    void updateNickname_없는유저는_예외발생() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThrows(UserNotFoundException.class, () -> userService.updateNickname(1L, "새닉네임"));
    }

    @Test
    @DisplayName("프로필 이미지 수정 - 정상")
    void updateProfileImg_정상수정() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // when
        userService.updateProfileImg(1L, "img.jpg");

        // then
        assertEquals("img.jpg", user.getProfileImg());
    }

    @Test
    @DisplayName("프로필 이미지 수정 - 유저 없음")
    void updateProfileImg_없는유저는_예외발생() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThrows(UserNotFoundException.class, () -> userService.updateProfileImg(1L, "img.jpg"));
    }

    @Test
    @DisplayName("비밀번호 변경 - 정상")
    void updatePassword_정상변경() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current", user.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("new", user.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("new")).thenReturn("newEncoded");

        // when
        userService.updatePassword(1L, "current", "new");

        // then
        assertEquals("newEncoded", user.getPassword());
    }

    @Test
    @DisplayName("비밀번호 변경 - 현재 비밀번호 불일치")
    void updatePassword_현재비번틀림() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current", user.getPassword())).thenReturn(false);

        // when & then
        assertThrows(InvalidCurrentPasswordException.class, () -> userService.updatePassword(1L, "current", "new"));
    }

    @Test
    @DisplayName("비밀번호 변경 - 새 비밀번호가 기존과 동일")
    void updatePassword_기존비번과같음() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current", user.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("new", user.getPassword())).thenReturn(true);

        // when & then
        assertThrows(PasswordRedundancyException.class, () -> userService.updatePassword(1L, "current", "new"));
    }

    @Test
    @DisplayName("회원 탈퇴 - 정상")
    void deleteUser_정상삭제() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // when
        userService.deleteUser(1L);

        // then
        assertTrue(user.isDeleted());
        assertEquals("탈퇴한 사용자", user.getNickname());
    }

    @Test
    @DisplayName("회원 탈퇴 - 유저 없음")
    void deleteUser_없는유저() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        assertThrows(UserNotFoundException.class, () -> userService.deleteUser(1L));
    }
}

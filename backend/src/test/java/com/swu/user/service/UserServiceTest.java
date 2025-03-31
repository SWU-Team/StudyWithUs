package com.swu.user.service;

import com.swu.user.dto.request.SignupRequest;
import com.swu.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;


@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("회원가입 성공 시 DB에 유저 저장")
    void signup() {
        // given
        SignupRequest req = SignupRequest.builder().
                email("test@gmail.com")
                .password("1234")
                .nickname("test")
                .build();

        // when
        userService.signup(req);

        // then
        assertThat(userRepository.existsByEmail("test@gmail.com")).isTrue();
    }

    @Test
    @DisplayName("중복 이메일로 회원가입 시 예외 발생")
    void signupDuplicateEmail() {
        // given
        String email = "test@gmail.com";
        SignupRequest req1 = SignupRequest.builder()
                .email(email)
                .password("1234")
                .nickname("user1")
                .build();

        SignupRequest req2 = SignupRequest.builder()
                .email(email)
                .password("5678")
                .nickname("user2")
                .build();

        // when
        userService.signup(req1);

        // then
        assertThatThrownBy(() -> userService.signup(req2))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("이미 존재하는 이메일");
    }
}
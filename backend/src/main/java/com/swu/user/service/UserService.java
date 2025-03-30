package com.swu.user.service;

import com.swu.user.domain.Grade;
import com.swu.user.domain.LoginType;
import com.swu.user.domain.Role;
import com.swu.user.domain.User;
import com.swu.user.dto.request.SignupRequest;
import com.swu.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .role(Role.USER)
                .loginType(LoginType.LOCAL)
                .grade(Grade.BRONZE)
                .profileImg(request.getProfileImg())
                .build();

        userRepository.save(user);
    }
}

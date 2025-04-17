package com.swu.user.service;

import com.swu.user.domain.Grade;
import com.swu.user.domain.LoginType;
import com.swu.user.domain.Role;
import com.swu.user.domain.User;
import com.swu.user.dto.request.SignupRequest;
import com.swu.user.dto.response.UserInfoResponse;
import com.swu.user.exception.UserNotFoundException;
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

    @Transactional(readOnly = true)
    public UserInfoResponse getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException());

        return UserInfoResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .role(user.getRole())
                .loginType(user.getLoginType())
                .grade(user.getGrade())
                .profileImg(user.getProfileImg())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }

    @Transactional
    public void updateNickname(Long userId, String nickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException());

        user.updateNickname(nickname);
    }

    @Transactional
    public void updateProfileImg(Long userId, String profileImg) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException());

        user.updateProfileImg(profileImg);
    }
}

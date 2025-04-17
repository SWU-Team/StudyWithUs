package com.swu.user.service;

import com.swu.user.domain.Grade;
import com.swu.user.domain.LoginType;
import com.swu.user.domain.Role;
import com.swu.user.domain.User;
import com.swu.user.dto.request.SignupRequest;
import com.swu.user.dto.response.UserInfoResponse;
import com.swu.user.exception.EmailAlreadyExistsException;
import com.swu.user.exception.InvalidCurrentPasswordException;
import com.swu.user.exception.PasswordRedundancyException;
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
            throw new EmailAlreadyExistsException();
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
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

    @Transactional
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException());

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new InvalidCurrentPasswordException();
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new PasswordRedundancyException();
        }        

        user.updatePassword(passwordEncoder.encode(newPassword));
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException());

        user.withdraw();
    }
}

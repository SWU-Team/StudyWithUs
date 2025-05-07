package com.swu.auth.service;

import java.util.UUID;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.swu.auth.dto.GoogleResponse;
import com.swu.auth.dto.NaverResponse;
import com.swu.auth.dto.OAuth2Response;
import com.swu.auth.entity.PrincipalDetails;
import com.swu.domain.user.entity.LoginType;
import com.swu.domain.user.entity.Role;
import com.swu.domain.user.entity.User;
import com.swu.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {
            log.info("Naver user info: {}", oAuth2User.getAttributes());
            
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else if (registrationId.equals("google")) {
            log.info("Google user info: {}", oAuth2User.getAttributes());

            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else {
            return null;
        }

        String email = oAuth2Response.getEmail();
        LoginType loginType = LoginType.valueOf(oAuth2Response.getProvider().toUpperCase());

        User existData = userRepository.findByEmail(email).orElse(null);

        if (existData == null) {
            User user = User.builder()
                .email(email)
                .nickname("user_" + UUID.randomUUID().toString().substring(0, 8))
                .loginType(loginType)
                .role(Role.PREUSER)
                .build();
            
            userRepository.save(user);

            return new PrincipalDetails(user);
        } else {
            return new PrincipalDetails(existData); 
        }
    }
}

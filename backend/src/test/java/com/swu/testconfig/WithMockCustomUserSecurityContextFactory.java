package com.swu.testconfig;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import com.swu.auth.entity.CustomUserDetails;
import com.swu.domain.user.entity.User;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
public class WithMockCustomUserSecurityContextFactory implements WithSecurityContextFactory<WithMockCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser annotation) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        User user = User.builder()
                .id(annotation.id())
                .email(annotation.email())
                .nickname(annotation.nickname())
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(user);

        Authentication auth =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        context.setAuthentication(auth);
        return context;
    }
}

package com.swu.config;

import com.swu.auth.handler.CustomAuthenticationEntryPoint;
import com.swu.auth.jwt.CustomLogoutFilter;
import com.swu.auth.jwt.JWTFilter;
import com.swu.auth.jwt.JWTUtil;
import com.swu.auth.jwt.LoginFilter;
import com.swu.auth.service.CustomOAuth2UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint; 
    private final RedisTemplate<String, Object> redisTemplate;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable());
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/ws/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/users/complete-info").hasRole("PREUSER")
                        .requestMatchers("/api/**").hasRole("USER")
                        .anyRequest().authenticated()
                );
        http
                .exceptionHandling(exception -> exception
                .authenticationEntryPoint(customAuthenticationEntryPoint) 
                );       
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService)));
        http
                .addFilterAt(new LoginFilter(authenticationConfiguration.getAuthenticationManager(), jwtUtil, redisTemplate), UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(new JWTFilter(jwtUtil), LoginFilter.class);
        http
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, redisTemplate), LogoutFilter.class);
        http
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}

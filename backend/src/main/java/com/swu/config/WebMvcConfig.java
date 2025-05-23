package com.swu.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // 개발 중이니까 모든 origin 허용
                .allowedMethods("*")        // GET, POST 등 전부 허용
                .allowedHeaders("*")
                .exposedHeaders("Authorization") // Authorization 헤더를 클라이언트에 노출
                .allowCredentials(true);    // 쿠키 허용 (선택사항)
    }
}

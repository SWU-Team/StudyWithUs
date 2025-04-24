package com.swu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
    
        // Java 8 날짜/시간 타입(LocalDate, LocalDateTime 등) 지원을 위한 모듈 등록
        mapper.registerModule(new JavaTimeModule());
        // 날짜를 timestamp 배열([2025,4,20])이 아닌 ISO-8601 문자열("2025-04-20")로 직렬화하도록 설정
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        return mapper;
    }
}

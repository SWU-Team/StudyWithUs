package com.swu.auth.dto;

import java.util.Map;

public class KakaoResponse implements OAuth2Response {

    private final Map<String, Object> attribute;

    public KakaoResponse(Map<String, Object> attribute) {
        this.attribute = (Map<String, Object>) attribute.get("kakao_account");
    }
    
    @Override
    public String getProvider() {
        return "kakao";
    }
    
    @Override
    public String getEmail() {
        return attribute.get("email").toString();
    }
}
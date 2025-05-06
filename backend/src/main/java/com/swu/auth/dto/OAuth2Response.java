package com.swu.auth.dto;

public interface OAuth2Response {

    //제공자 (Ex. naver, google, ...)
    String getProvider();
    
    //이메일
    String getEmail();
}

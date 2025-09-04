package com.jiaowu.request.platform;

import lombok.Data;

@Data
public class LoginRequest {

    private String username;

    private String password;

    private String verificationCode;

    private String sessionId;
}
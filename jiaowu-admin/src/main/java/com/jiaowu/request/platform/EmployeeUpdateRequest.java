package com.jiaowu.request.platform;

import lombok.Data;

@Data
public class EmployeeUpdateRequest {
    private String username;
    private String password;
    private String gender;
    private String nickname;
    private String title;
    private String email;
    private Integer enrollYear;
    private Integer status;
}
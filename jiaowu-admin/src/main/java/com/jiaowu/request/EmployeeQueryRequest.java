package com.jiaowu.request;

public class EmployeeQueryRequest extends PageRequest {
    private String username;
    private String nickname;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}

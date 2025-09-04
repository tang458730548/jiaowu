package com.jiaowu.request.platform;

import com.jiaowu.request.common.PageRequest;
import lombok.Data;

@Data
public class EmployeeQueryRequest extends PageRequest {
    private String username;
    private String nickname;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}

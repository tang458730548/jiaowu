package com.jiaowu.request;

public class EmployeeUpdateRequest {
    private String username;
    private String password;
    private String gender;
    private String nickname;
    private String title;
    private String email;
    private Integer enrollYear;
    private Integer status;

    // getter 和 setter
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getEnrollYear() { return enrollYear; }
    public void setEnrollYear(Integer enrollYear) { this.enrollYear = enrollYear; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
} 
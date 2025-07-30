package com.jiaowu.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_jw_verification_code")
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 4)
    private String code;

    @Column(nullable = false)
    private String sessionId;

    @Column(nullable = false)
    private Date createTime;

    @Column(nullable = false)
    private Date expireTime;

    @Column(nullable = false)
    private Boolean used = false;

    @Column(length = 50)
    private String username;

    // getter 和 setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public Date getCreateTime() { return createTime; }
    public void setCreateTime(Date createTime) { this.createTime = createTime; }

    public Date getExpireTime() { return expireTime; }
    public void setExpireTime(Date expireTime) { this.expireTime = expireTime; }

    public Boolean getUsed() { return used; }
    public void setUsed(Boolean used) { this.used = used; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
} 
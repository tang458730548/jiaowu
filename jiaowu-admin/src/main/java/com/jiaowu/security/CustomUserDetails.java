package com.jiaowu.security;

/**
 * description:
 *
 * @author tsc
 * @since 2025-9-7
 */

import com.jiaowu.entity.platform.TbJwEmployee;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * 自定义UserDetails实现，封装用户认证信息和业务信息
 */
public class CustomUserDetails implements UserDetails {

    // 持有业务用户实体
    private final TbJwEmployee employee;
    // 用户权限集合
    private final List<GrantedAuthority> authorities;

    public CustomUserDetails(TbJwEmployee employee, List<String> roles) {
        this.employee = employee;
        // 将角色转换为Spring Security需要的权限格式（ROLE_前缀）
        this.authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(java.util.stream.Collectors.toList());
    }

    // -------------- 实现UserDetails接口方法 --------------
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities; // 返回用户权限（角色）
    }

    @Override
    public String getPassword() {
        return employee.getPassword(); // 返回加密后的密码
    }

    @Override
    public String getUsername() {
        return employee.getUsername(); // 返回登录用户名
    }

    @Override
    public boolean isAccountNonExpired() {
        // 检查账户是否未过期（null表示永不过期）
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        // 状态为2表示锁定
        return employee.getStatus() != 0;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        // 状态为1表示启用
        return employee.getStatus() == 1;
    }

    // -------------- 自定义业务方法（获取额外用户信息） --------------
    public Long getId() {
        return employee.getId();
    }

    public String getNickname() {
        return employee.getNickname();
    }

    public String getEmail() {
        return employee.getEmail();
    }
}


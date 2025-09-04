package com.jiaowu.service.impl.platform;

import com.jiaowu.entity.platform.TbJwEmployee;
import com.jiaowu.service.platform.EmployeeService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * @author Administrator
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final EmployeeService employeeService;

    public UserDetailsServiceImpl(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 从数据库查询用户
        TbJwEmployee employee = employeeService.findByUsername(username);
        if (employee == null) {
            throw new UsernameNotFoundException("用户不存在!");
        }
        // 检查职工状态
        if (employee.getStatus() != null && employee.getStatus() == 0) {
            throw new RuntimeException("用户已被禁用，请联系管理员！");
        }
        // 封装成Spring Security需要的UserDetails对象
        return org.springframework.security.core.userdetails.User.builder()
                .username(employee.getUsername())
                .password(employee.getPassword())
                .roles("employee")
                .build();
    }
}
    
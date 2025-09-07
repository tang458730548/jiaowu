package com.jiaowu.security;

import com.jiaowu.entity.platform.TbJwEmployee;
import com.jiaowu.service.platform.EmployeeService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

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
//        // 封装成Spring Security需要的UserDetails对象
//        return org.springframework.security.core.userdetails.User.builder()
//                .username(employee.getUsername())
//                .password(employee.getPassword())
//                .roles("employee")
//                .build();

        // 2. 查询用户角色（实际项目中从数据库查询，这里简化为固定角色）
        List<String> roles = new ArrayList<>();
        // 示例：如果是管理员ID为1，则赋予ADMIN角色，否则赋予USER角色
        // roles = user.getId().equals(1L) ? List.of("ADMIN") : List.of("USER");
        // 3. 转换为CustomUserDetails并返回
        return new CustomUserDetails(employee, roles);
    }
}
    
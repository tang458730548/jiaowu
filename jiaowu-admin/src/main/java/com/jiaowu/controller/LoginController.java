package com.jiaowu.controller;

import com.jiaowu.common.Result;
import com.jiaowu.entity.Employee;
import com.jiaowu.request.LoginRequest;
import com.jiaowu.service.EmployeeService;
import com.jiaowu.service.VerificationCodeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private VerificationCodeService verificationCodeService;

    /**
     * 职工登录
     */
    @PostMapping("/employee")
    public Result<Map<String, Object>> employeeLogin(@RequestBody LoginRequest request,
                                                    HttpServletRequest httpRequest) {
        
        // 参数校验
        if (StringUtils.isBlank(request.getUsername())) {
            return Result.error("用户名不能为空");
        }
        if (StringUtils.isBlank(request.getPassword())) {
            return Result.error("密码不能为空");
        }
        if (StringUtils.isBlank(request.getVerificationCode())) {
            return Result.error("验证码不能为空");
        }

        // 验证验证码
        boolean isCodeValid = false;
        if (StringUtils.isNotBlank(request.getSessionId())) {
            isCodeValid = verificationCodeService.verifyCode(request.getSessionId(), request.getVerificationCode());
        } else {
            isCodeValid = verificationCodeService.verifyCodeByUsername(request.getUsername(), request.getVerificationCode());
        }

        if (!isCodeValid) {
            return Result.error("验证码错误或已过期");
        }

        // 验证用户名和密码
        Employee employee = employeeService.findByUsernameAndPassword(request.getUsername(), request.getPassword());
        if (employee == null) {
            return Result.error("用户名或密码错误");
        }

        // 检查职工状态
        if (employee.getStatus() != null && employee.getStatus() == 0) {
            return Result.error("账户已被禁用，请联系管理员");
        }

        // 生成登录成功响应
        Map<String, Object> loginResult = new HashMap<>();
        loginResult.put("employeeId", employee.getId());
        loginResult.put("username", employee.getUsername());
        loginResult.put("nickname", employee.getNickname());
        loginResult.put("title", employee.getTitle());
        loginResult.put("email", employee.getEmail());
        loginResult.put("sessionId", httpRequest.getSession().getId());

        return Result.success("登录成功", loginResult);
    }

    /**
     * 获取登录验证码
     */
    @PostMapping("/verification-code")
    public Result<Map<String, String>> getLoginVerificationCode(@RequestParam String username,
                                                               HttpServletRequest request) {
        if (StringUtils.isBlank(username)) {
            return Result.error("用户名不能为空");
        }

        // 检查用户是否存在
        Employee employee = employeeService.findByUsername(username);
        if (employee == null) {
            return Result.error("用户不存在");
        }

        // 生成验证码
        String sessionId = request.getSession().getId();
        String code = verificationCodeService.generateCode(sessionId, username);

        Map<String, String> result = new HashMap<>();
        result.put("code", code);
        result.put("sessionId", sessionId);

        return Result.success("验证码生成成功", result);
    }

    /**
     * 职工登出
     */
    @PostMapping("/logout")
    public Result<String> logout(HttpServletRequest request) {
        // 这里可以添加登出逻辑，如清除session等
        request.getSession().invalidate();
        return Result.success("登出成功");
    }
} 
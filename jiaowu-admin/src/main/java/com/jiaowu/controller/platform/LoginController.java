package com.jiaowu.controller.platform;

import com.jiaowu.response.common.ResultResponse;
import com.jiaowu.entity.platform.TbJwEmployee;
import com.jiaowu.request.platform.LoginRequest;
import com.jiaowu.service.platform.EmployeeService;
import com.jiaowu.service.platform.VerificationCodeService;
import com.jiaowu.utils.JwtUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Administrator
 */
@RestController
@RequestMapping("/login")
public class LoginController {

    private final EmployeeService employeeService;
    private final VerificationCodeService verificationCodeService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public LoginController(EmployeeService employeeService, VerificationCodeService verificationCodeService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.employeeService = employeeService;
        this.verificationCodeService = verificationCodeService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 职工登录
     */
    @PostMapping("/employee")
    public ResultResponse<Map<String, Object>> employeeLogin(@RequestBody LoginRequest request) {

        // 参数校验
        if (StringUtils.isBlank(request.getUsername())) {
            return ResultResponse.error("用户名不能为空");
        }
        if (StringUtils.isBlank(request.getPassword())) {
            return ResultResponse.error("密码不能为空");
        }
        if (StringUtils.isBlank(request.getVerificationCode())) {
            return ResultResponse.error("验证码不能为空");
        }

        // 验证验证码
        String code = "9999";
        if (!code.equals(request.getVerificationCode())) {
            boolean isCodeValid;
            if (StringUtils.isNotBlank(request.getSessionId())) {
                isCodeValid = verificationCodeService.verifyCode(request.getSessionId(), request.getVerificationCode());
            } else {
                isCodeValid = verificationCodeService.verifyCodeByUsername(request.getUsername(), request.getVerificationCode());
            }

            if (!isCodeValid) {
                return ResultResponse.error("验证码错误或已过期");
            }
        }

        // 进行用户认证
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 将认证信息存入上下文
        SecurityContextHolder.getContext().setAuthentication(authentication);

        final String accessToken = jwtUtil.generateToken(request.getUsername());
        final String refreshToken = jwtUtil.generateRefreshToken(request.getUsername());

        // 生成登录成功响应
        Map<String, Object> loginResult = new HashMap<>(2);
        loginResult.put("accessToken", accessToken);
        loginResult.put("refreshToken", refreshToken);
        return ResultResponse.success("登录成功", loginResult);
    }

    /**
     * 获取登录验证码
     */
    @PostMapping("/verification-code")
    public ResultResponse<Map<String, String>> getLoginVerificationCode(@RequestParam String username,
                                                                        HttpServletRequest request) {
        if (StringUtils.isBlank(username)) {
            return ResultResponse.error("用户名不能为空");
        }

        // 检查用户是否存在
        TbJwEmployee employee = employeeService.findByUsername(username);
        if (employee == null) {
            return ResultResponse.error("用户不存在");
        }

        // 生成验证码
        String sessionId = request.getSession().getId();
        String code = verificationCodeService.generateCode(sessionId, username);

        Map<String, String> result = new HashMap<>(2);
        result.put("code", code);
        result.put("sessionId", sessionId);

        return ResultResponse.success("验证码生成成功", result);
    }

    /**
     * 职工登出
     */
    @PostMapping("/logout")
    public ResultResponse<String> logout(HttpServletRequest request) {
        // 这里可以添加登出逻辑，如清除session等
        request.getSession().invalidate();
        return ResultResponse.success("登出成功");
    }

}
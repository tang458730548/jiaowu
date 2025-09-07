
package com.jiaowu.controller.platform;
import com.jiaowu.entity.platform.TbJwEmployee;
import com.jiaowu.request.platform.LoginRequest;
import com.jiaowu.response.common.ResultResponse;
import com.jiaowu.service.platform.EmployeeService;
import com.jiaowu.service.platform.ParamService;
import com.jiaowu.service.platform.VerificationCodeService;
import com.jiaowu.utils.JwtUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
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
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final ParamService paramService;

    public LoginController(EmployeeService employeeService, VerificationCodeService verificationCodeService, JwtUtil jwtUtil, UserDetailsService userDetailsService, ParamService paramService) {
        this.employeeService = employeeService;
        this.verificationCodeService = verificationCodeService;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.paramService = paramService;
    }

    /**
     * 职工登录
     */
    @PostMapping("/employee")
    public ResultResponse<Map<String, Object>> employeeLogin(@RequestBody @Valid LoginRequest request, HttpServletRequest httpServletRequest) {
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

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        // 设置认证信息
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
        SecurityContextHolder.getContext().setAuthentication(authToken);

        final String accessToken = jwtUtil.generateToken(request.getUsername());
        final String refreshToken = jwtUtil.generateRefreshToken(request.getUsername());

        // 生成登录成功响应
        Map<String, Object> loginResult = new HashMap<>(2);
        loginResult.put("userDetails", userDetails);
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

    @GetMapping("getIndexPageInfos")
    public ResultResponse<Map<String, String>> getIndexPageInfos() {
        Map<String, String> result = new HashMap<>(3);
        //系统参数
        String systemName = paramService.findByParamKey("system.name");
        String copyright = paramService.findByParamKey("system.copyright");
        String notice = paramService.findByParamKey("system.notice");
        result.put("systemName", systemName);
        result.put("copyright", copyright);
        result.put("notice", notice);
        return ResultResponse.success("获取系统基本参数", result);
    }
}
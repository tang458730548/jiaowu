package com.jiaowu.controller.platform;

import com.jiaowu.response.common.ResultResponse;
import com.jiaowu.service.platform.VerificationCodeService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Administrator
 */
@RestController
@RequestMapping("/verification")
public class VerificationCodeController {

    private final VerificationCodeService verificationCodeService;

    public VerificationCodeController(VerificationCodeService verificationCodeService) {
        this.verificationCodeService = verificationCodeService;
    }

    /**
     * 生成验证码
     */
    @PostMapping("/generate")
    public ResultResponse<Map<String, String>> generateCode(@RequestParam(required = false) String username,
                                                            HttpServletRequest request) {
        // 获取sessionId，如果没有则生成一个
        String sessionId = request.getSession().getId();

        // 生成验证码
        String code = verificationCodeService.generateCode(sessionId, username);

        Map<String, String> result = new HashMap<>(2);
        result.put("code", code);
        result.put("sessionId", sessionId);

        return ResultResponse.success("验证码生成成功", result);
    }

    /**
     * 验证验证码
     */
    @PostMapping("/verify")
    public ResultResponse<Boolean> verifyCode(@RequestParam String code,
                                              @RequestParam(required = false) String sessionId,
                                              @RequestParam(required = false) String username,
                                              HttpServletRequest request) {
        boolean isValid;

        if (sessionId != null) {
            // 使用sessionId验证
            isValid = verificationCodeService.verifyCode(sessionId, code);
        } else if (username != null) {
            // 使用用户名验证
            isValid = verificationCodeService.verifyCodeByUsername(username, code);
        } else {
            // 使用当前session验证
            String currentSessionId = request.getSession().getId();
            isValid = verificationCodeService.verifyCode(currentSessionId, code);
        }

        if (isValid) {
            return ResultResponse.success("验证码验证成功", true);
        } else {
            return ResultResponse.error("验证码验证失败");
        }
    }

    /**
     * 清理过期验证码
     */
    @PostMapping("/clean")
    public ResultResponse<String> cleanExpiredCodes() {
        verificationCodeService.cleanExpiredCodes();
        return ResultResponse.success("过期验证码清理成功");
    }
} 
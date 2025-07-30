package com.jiaowu.controller;

import com.jiaowu.common.Result;
import com.jiaowu.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/verification")
public class VerificationCodeController {

    @Autowired
    private VerificationCodeService verificationCodeService;

    /**
     * 生成验证码
     */
    @PostMapping("/generate")
    public Result<Map<String, String>> generateCode(@RequestParam(required = false) String username, 
                                                   HttpServletRequest request) {
        // 获取sessionId，如果没有则生成一个
        String sessionId = request.getSession().getId();
        
        // 生成验证码
        String code = verificationCodeService.generateCode(sessionId, username);
        
        Map<String, String> result = new HashMap<>();
        result.put("code", code);
        result.put("sessionId", sessionId);
        
        return Result.success("验证码生成成功", result);
    }

    /**
     * 验证验证码
     */
    @PostMapping("/verify")
    public Result<Boolean> verifyCode(@RequestParam String code, 
                                    @RequestParam(required = false) String sessionId,
                                    @RequestParam(required = false) String username,
                                    HttpServletRequest request) {
        boolean isValid = false;
        
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
            return Result.success("验证码验证成功", true);
        } else {
            return Result.error("验证码验证失败");
        }
    }

    /**
     * 清理过期验证码
     */
    @PostMapping("/clean")
    public Result<String> cleanExpiredCodes() {
        verificationCodeService.cleanExpiredCodes();
        return Result.success("过期验证码清理成功");
    }
} 
package com.jiaowu.service.platform;

public interface VerificationCodeService {
    
    /**
     * 生成验证码
     * @param sessionId 会话ID
     * @param username 用户名（可选）
     * @return 验证码
     */
    String generateCode(String sessionId, String username);
    
    /**
     * 验证验证码
     * @param sessionId 会话ID
     * @param code 验证码
     * @return 是否验证成功
     */
    boolean verifyCode(String sessionId, String code);
    
    /**
     * 根据用户名验证验证码
     * @param username 用户名
     * @param code 验证码
     * @return 是否验证成功
     */
    boolean verifyCodeByUsername(String username, String code);
    
    /**
     * 清理过期验证码
     */
    void cleanExpiredCodes();
} 
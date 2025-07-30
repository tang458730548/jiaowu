package com.jiaowu.service.impl;

import com.jiaowu.entity.VerificationCode;
import com.jiaowu.repository.VerificationCodeRepository;
import com.jiaowu.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class VerificationCodeServiceImpl implements VerificationCodeService {

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Override
    public String generateCode(String sessionId, String username) {
        // 生成4位随机数字验证码
        Random random = new Random();
        String code = String.format("%04d", random.nextInt(10000));
        
        // 创建验证码实体
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setCode(code);
        verificationCode.setSessionId(sessionId);
        verificationCode.setUsername(username);
        verificationCode.setCreateTime(new Date());
        
        // 设置过期时间为5分钟后
        Date expireTime = new Date(System.currentTimeMillis() + 5 * 60 * 1000);
        verificationCode.setExpireTime(expireTime);
        verificationCode.setUsed(false);
        
        // 保存到数据库
        verificationCodeRepository.save(verificationCode);
        
        return code;
    }

    @Override
    public boolean verifyCode(String sessionId, String code) {
        Optional<VerificationCode> optional = verificationCodeRepository.findValidBySessionId(sessionId, new Date());
        
        if (optional.isPresent()) {
            VerificationCode verificationCode = optional.get();
            if (verificationCode.getCode().equals(code)) {
                // 标记为已使用
                verificationCode.setUsed(true);
                verificationCodeRepository.save(verificationCode);
                return true;
            }
        }
        
        return false;
    }

    @Override
    public boolean verifyCodeByUsername(String username, String code) {
        Optional<VerificationCode> optional = verificationCodeRepository.findValidByUsername(username, new Date());
        
        if (optional.isPresent()) {
            VerificationCode verificationCode = optional.get();
            if (verificationCode.getCode().equals(code)) {
                // 标记为已使用
                verificationCode.setUsed(true);
                verificationCodeRepository.save(verificationCode);
                return true;
            }
        }
        
        return false;
    }

    @Override
    public void cleanExpiredCodes() {
        verificationCodeRepository.deleteExpiredCodes(new Date());
    }
} 
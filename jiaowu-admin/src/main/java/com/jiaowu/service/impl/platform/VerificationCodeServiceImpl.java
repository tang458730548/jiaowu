package com.jiaowu.service.impl.platform;

import com.jiaowu.entity.platform.TbJwVerificationCode;
import com.jiaowu.repository.platform.VerificationCodeRepository;
import com.jiaowu.service.platform.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class VerificationCodeServiceImpl implements VerificationCodeService {

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Override
    public String generateCode(String sessionId, String username) {
        // 先将该sessionId的旧验证码标记为已使用
        List<TbJwVerificationCode> oldCodes = verificationCodeRepository.findBySessionIdAndUsedFalse(sessionId);
        for (TbJwVerificationCode oldCode : oldCodes) {
            oldCode.setUsed(true);
            verificationCodeRepository.save(oldCode);
        }
        
        // 如果提供了用户名，也将该用户名的旧验证码标记为已使用
        if (username != null && !username.trim().isEmpty()) {
            List<TbJwVerificationCode> oldUserCodes = verificationCodeRepository.findByUsernameAndUsedFalse(username);
            for (TbJwVerificationCode oldUserCode : oldUserCodes) {
                oldUserCode.setUsed(true);
                verificationCodeRepository.save(oldUserCode);
            }
        }
        
        // 生成4位随机数字验证码
        Random random = new Random();
        String code = String.format("%04d", random.nextInt(10000));
        
        // 创建验证码实体
        TbJwVerificationCode verificationCode = new TbJwVerificationCode();
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
        Optional<TbJwVerificationCode> optional = verificationCodeRepository.findValidBySessionId(sessionId, new Date());
        
        if (optional.isPresent()) {
            TbJwVerificationCode verificationCode = optional.get();
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
        Optional<TbJwVerificationCode> optional = verificationCodeRepository.findValidByUsername(username, new Date());
        
        if (optional.isPresent()) {
            TbJwVerificationCode verificationCode = optional.get();
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
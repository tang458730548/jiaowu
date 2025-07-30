package com.jiaowu.repository;

import com.jiaowu.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    
    // 根据sessionId查找未使用的验证码
    @Query("SELECT vc FROM VerificationCode vc WHERE vc.sessionId = :sessionId AND vc.used = false AND vc.expireTime > :now ORDER BY vc.createTime DESC")
    Optional<VerificationCode> findValidBySessionId(@Param("sessionId") String sessionId, @Param("now") Date now);
    
    // 根据用户名查找未使用的验证码
    @Query("SELECT vc FROM VerificationCode vc WHERE vc.username = :username AND vc.used = false AND vc.expireTime > :now ORDER BY vc.createTime DESC")
    Optional<VerificationCode> findValidByUsername(@Param("username") String username, @Param("now") Date now);
    
    // 清理过期的验证码
    @Query("DELETE FROM VerificationCode vc WHERE vc.expireTime < :now")
    void deleteExpiredCodes(@Param("now") Date now);
    
    // 根据sessionId查找未使用的验证码
    @Query("SELECT vc FROM VerificationCode vc WHERE vc.sessionId = :sessionId AND vc.used = false")
    List<VerificationCode> findBySessionIdAndUsedFalse(@Param("sessionId") String sessionId);
    
    // 根据用户名查找未使用的验证码
    @Query("SELECT vc FROM VerificationCode vc WHERE vc.username = :username AND vc.used = false")
    List<VerificationCode> findByUsernameAndUsedFalse(@Param("username") String username);
} 
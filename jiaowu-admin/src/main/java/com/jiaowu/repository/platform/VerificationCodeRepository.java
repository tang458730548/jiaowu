package com.jiaowu.repository.platform;

import com.jiaowu.entity.platform.TbJwVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<TbJwVerificationCode, Long> {
    
    // 根据sessionId查找未使用的验证码
    @Query("SELECT vc FROM TbJwVerificationCode vc WHERE vc.sessionId = :sessionId AND vc.used = false AND vc.expireTime > :now ORDER BY vc.createTime DESC")
    Optional<TbJwVerificationCode> findValidBySessionId(@Param("sessionId") String sessionId, @Param("now") Date now);
    
    // 根据用户名查找未使用的验证码
    @Query("SELECT vc FROM TbJwVerificationCode vc WHERE vc.username = :username AND vc.used = false AND vc.expireTime > :now ORDER BY vc.createTime DESC")
    Optional<TbJwVerificationCode> findValidByUsername(@Param("username") String username, @Param("now") Date now);
    
    // 清理过期的验证码
    @Query("DELETE FROM TbJwVerificationCode vc WHERE vc.expireTime < :now")
    void deleteExpiredCodes(@Param("now") Date now);
    
    // 根据sessionId查找未使用的验证码
    @Query("SELECT vc FROM TbJwVerificationCode vc WHERE vc.sessionId = :sessionId AND vc.used = false")
    List<TbJwVerificationCode> findBySessionIdAndUsedFalse(@Param("sessionId") String sessionId);
    
    // 根据用户名查找未使用的验证码
    @Query("SELECT vc FROM TbJwVerificationCode vc WHERE vc.username = :username AND vc.used = false")
    List<TbJwVerificationCode> findByUsernameAndUsedFalse(@Param("username") String username);
} 
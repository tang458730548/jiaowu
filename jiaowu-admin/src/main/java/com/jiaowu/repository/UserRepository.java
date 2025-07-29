package com.jiaowu.repository;

import com.jiaowu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 用户数据访问层接口
 * 
 * @author jiaowu
 * @since 1.0.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 根据用户名查找用户
     */
    Optional<User> findByUsername(String username);
    
    /**
     * 根据邮箱查找用户
     */
    Optional<User> findByEmail(String email);
    
    /**
     * 根据角色查找用户列表
     */
    List<User> findByRole(User.UserRole role);
    
    /**
     * 根据状态查找用户列表
     */
    List<User> findByStatus(User.UserStatus status);
    
    /**
     * 根据用户名和状态查找用户
     */
    Optional<User> findByUsernameAndStatus(String username, User.UserStatus status);
    
    /**
     * 检查用户名是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);
    
    /**
     * 根据用户名模糊查询
     */
    @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword% OR u.realName LIKE %:keyword%")
    List<User> findByUsernameOrRealNameContaining(@Param("keyword") String keyword);
    
    /**
     * 根据角色和状态查找用户
     */
    List<User> findByRoleAndStatus(User.UserRole role, User.UserStatus status);
} 
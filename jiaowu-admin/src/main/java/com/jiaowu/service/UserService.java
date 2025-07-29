package com.jiaowu.service;

import com.jiaowu.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 用户服务接口
 * 
 * @author jiaowu
 * @since 1.0.0
 */
public interface UserService {
    
    /**
     * 创建用户
     */
    User createUser(User user);
    
    /**
     * 更新用户信息
     */
    User updateUser(Long id, User user);
    
    /**
     * 根据ID查找用户
     */
    Optional<User> findById(Long id);
    
    /**
     * 根据用户名查找用户
     */
    Optional<User> findByUsername(String username);
    
    /**
     * 获取所有用户
     */
    List<User> findAll();
    
    /**
     * 分页查询用户
     */
    Page<User> findAll(Pageable pageable);
    
    /**
     * 根据角色查找用户
     */
    List<User> findByRole(User.UserRole role);
    
    /**
     * 根据状态查找用户
     */
    List<User> findByStatus(User.UserStatus status);
    
    /**
     * 搜索用户
     */
    List<User> searchUsers(String keyword);
    
    /**
     * 删除用户
     */
    void deleteUser(Long id);
    
    /**
     * 检查用户名是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 检查邮箱是否存在
     */
    boolean existsByEmail(String email);
} 
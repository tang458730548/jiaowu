package com.jiaowu.controller;

import com.jiaowu.common.Result;
import com.jiaowu.entity.User;
import com.jiaowu.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 用户控制器
 * 
 * @author jiaowu
 * @since 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Validated
public class UserController {
    
    private final UserService userService;
    
    /**
     * 创建用户
     */
    @PostMapping
    public Result<User> createUser(@Valid @RequestBody User user) {
        log.info("创建用户请求: {}", user.getUsername());
        User createdUser = userService.createUser(user);
        return Result.success("用户创建成功", createdUser);
    }
    
    /**
     * 更新用户信息
     */
    @PutMapping("/{id}")
    public Result<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        log.info("更新用户请求: {}", id);
        User updatedUser = userService.updateUser(id, user);
        return Result.success("用户信息更新成功", updatedUser);
    }
    
    /**
     * 根据ID获取用户信息
     */
    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        log.info("获取用户信息: {}", id);
        return userService.findById(id)
                .map(user -> Result.success("获取用户信息成功", user))
                .orElse(Result.error("用户不存在"));
    }
    
    /**
     * 根据用户名获取用户信息
     */
    @GetMapping("/username/{username}")
    public Result<User> getUserByUsername(@PathVariable String username) {
        log.info("根据用户名获取用户信息: {}", username);
        return userService.findByUsername(username)
                .map(user -> Result.success("获取用户信息成功", user))
                .orElse(Result.error("用户不存在"));
    }
    
    /**
     * 获取所有用户
     */
    @GetMapping
    public Result<List<User>> getAllUsers() {
        log.info("获取所有用户");
        List<User> users = userService.findAll();
        return Result.success("获取用户列表成功", users);
    }
    
    /**
     * 分页查询用户
     */
    @GetMapping("/page")
    public Result<Page<User>> getUsersByPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        log.info("分页查询用户: page={}, size={}, sortBy={}, sortDir={}", page, size, sortBy, sortDir);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<User> users = userService.findAll(pageable);
        return Result.success("分页查询用户成功", users);
    }
    
    /**
     * 根据角色查询用户
     */
    @GetMapping("/role/{role}")
    public Result<List<User>> getUsersByRole(@PathVariable User.UserRole role) {
        log.info("根据角色查询用户: {}", role);
        List<User> users = userService.findByRole(role);
        return Result.success("根据角色查询用户成功", users);
    }
    
    /**
     * 根据状态查询用户
     */
    @GetMapping("/status/{status}")
    public Result<List<User>> getUsersByStatus(@PathVariable User.UserStatus status) {
        log.info("根据状态查询用户: {}", status);
        List<User> users = userService.findByStatus(status);
        return Result.success("根据状态查询用户成功", users);
    }
    
    /**
     * 搜索用户
     */
    @GetMapping("/search")
    public Result<List<User>> searchUsers(@RequestParam String keyword) {
        log.info("搜索用户: {}", keyword);
        List<User> users = userService.searchUsers(keyword);
        return Result.success("搜索用户成功", users);
    }
    
    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        log.info("删除用户: {}", id);
        userService.deleteUser(id);
        return Result.success();
    }
    
    /**
     * 检查用户名是否存在
     */
    @GetMapping("/check-username")
    public Result<Boolean> checkUsernameExists(@RequestParam String username) {
        log.info("检查用户名是否存在: {}", username);
        boolean exists = userService.existsByUsername(username);
        return Result.success("检查用户名成功", exists);
    }
    
    /**
     * 检查邮箱是否存在
     */
    @GetMapping("/check-email")
    public Result<Boolean> checkEmailExists(@RequestParam String email) {
        log.info("检查邮箱是否存在: {}", email);
        boolean exists = userService.existsByEmail(email);
        return Result.success("检查邮箱成功", exists);
    }
} 
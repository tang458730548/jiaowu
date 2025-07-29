package com.jiaowu.controller;

import com.jiaowu.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 测试控制器
 * 
 * @author jiaowu
 * @since 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/test")
public class TestController {
    
    /**
     * 健康检查接口
     */
    @GetMapping("/health")
    public Result<Map<String, Object>> health() {
        log.info("健康检查请求");
        
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("timestamp", LocalDateTime.now());
        data.put("service", "jiaowu-backend");
        data.put("version", "1.0.0");
        
        return Result.success("服务运行正常", data);
    }
    
    /**
     * 欢迎接口
     */
    @GetMapping("/welcome")
    public Result<String> welcome() {
        log.info("欢迎接口请求");
        return Result.success("欢迎使用教务管理系统后端服务！");
    }
} 
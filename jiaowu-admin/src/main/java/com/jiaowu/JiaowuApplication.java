package com.jiaowu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 教务管理系统后端服务启动类
 * 
 * @author jiaowu
 * @since 1.0.0
 */
@SpringBootApplication
public class JiaowuApplication {

    public static void main(String[] args) {
        SpringApplication.run(JiaowuApplication.class, args);
        System.out.println("教务管理系统后端服务启动成功！");
        System.out.println("访问地址: http://localhost:8080/api");
    }
} 
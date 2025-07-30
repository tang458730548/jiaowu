package com.jiaowu.repository;

import com.jiaowu.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // 可根据需要添加自定义查询方法
} 
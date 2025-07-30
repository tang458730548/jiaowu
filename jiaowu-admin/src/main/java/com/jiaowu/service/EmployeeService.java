package com.jiaowu.service;

import com.jiaowu.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface EmployeeService {
    Employee save(Employee employee);
    Employee update(Long id, Employee employee);
    void delete(Long id);
    Employee findById(Long id);
    List<Employee> findAll();
    Page<Employee> findAll(Pageable pageable);
    Page<Employee> findAll(Pageable pageable, String username, String nickname);
    Employee updateStatus(Long id, Employee employee);
    
    // 导出CSV
    byte[] exportToCsv(String username, String nickname);
    
    // 根据用户名查找职工
    Employee findByUsername(String username);
    
    // 根据用户名和密码查找职工
    Employee findByUsernameAndPassword(String username, String password);
}
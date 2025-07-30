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

    Employee updateStatus(Long id, Employee employee);
}
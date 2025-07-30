package com.jiaowu.service.impl;

import com.jiaowu.entity.Employee;
import com.jiaowu.repository.EmployeeRepository;
import com.jiaowu.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public Employee update(Long id, Employee employee) {
        Optional<Employee> optional = employeeRepository.findById(id);
        if (optional.isPresent()) {
            Employee exist = optional.get();
            exist.setUsername(employee.getUsername());
            exist.setPassword(employee.getPassword());
            exist.setGender(employee.getGender());
            exist.setNickname(employee.getNickname());
            exist.setTitle(employee.getTitle());
            exist.setEmail(employee.getEmail());
            exist.setEnrollYear(employee.getEnrollYear());
            exist.setStatus(employee.getStatus());
            // createTime不变，updateTime由数据库自动维护
            return employeeRepository.save(exist);
        }
        return null;
    }

    @Override
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public Employee findById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Page<Employee> findAll(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }
} 
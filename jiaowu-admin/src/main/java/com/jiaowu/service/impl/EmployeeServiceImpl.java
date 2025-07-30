package com.jiaowu.service.impl;

import com.jiaowu.entity.Employee;
import com.jiaowu.repository.EmployeeRepository;
import com.jiaowu.service.EmployeeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.dao.DataIntegrityViolationException;

import javax.validation.ConstraintViolationException;

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
            if (StringUtils.isNotBlank(employee.getUsername())) {
                exist.setUsername(employee.getUsername());
            }
            if (StringUtils.isNotBlank(employee.getGender())) {
                exist.setGender(employee.getGender());
            }
            if (StringUtils.isNotBlank(employee.getNickname())) {
                exist.setNickname(employee.getNickname());
            }
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

    @Override
    public Page<Employee> findAll(Pageable pageable, String username, String nickname) {
        return employeeRepository.findByUsernameAndNickname(username, nickname, pageable);
    }

    @Override
    public Employee updateStatus(Long id, Employee employee) {
        Optional<Employee> optional = employeeRepository.findById(id);
        if (optional.isPresent()) {
            Employee e = optional.get();
            e.setStatus(employee.getStatus());
            e.setUpdateTime(new Date());
            return employeeRepository.save(e);
        }
        return null;
    }

    @Override
    public byte[] exportToCsv(String username, String nickname) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
             OutputStreamWriter writer = new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)) {
            
            // 写入CSV头部（带BOM，解决中文乱码）
            writer.write('\ufeff');
            writer.write("ID,用户名,性别,昵称,职称,邮箱,入学年份,状态,创建时间,更新时间\n");
            
            // 获取所有数据（不分页）
            List<Employee> employees;
            if (StringUtils.isNotBlank(username) || StringUtils.isNotBlank(nickname)) {
                // 如果有查询条件，使用分页查询获取所有数据
                Page<Employee> page = employeeRepository.findByUsernameAndNickname(username, nickname, Pageable.unpaged());
                employees = page.getContent();
            } else {
                employees = employeeRepository.findAll();
            }
            
            // 填充数据
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for (Employee employee : employees) {
                StringBuilder line = new StringBuilder();
                line.append(employee.getId()).append(",");
                line.append(employee.getUsername()).append(",");
                line.append(employee.getGender()).append(",");
                line.append(employee.getNickname()).append(",");
                line.append(employee.getTitle()).append(",");
                line.append(employee.getEmail()).append(",");
                line.append(employee.getEnrollYear()).append(",");
                line.append(employee.getStatus()).append(",");
                line.append(employee.getCreateTime() != null ? sdf.format(employee.getCreateTime()) : "").append(",");
                line.append(employee.getUpdateTime() != null ? sdf.format(employee.getUpdateTime()) : "");
                line.append("\n");
                writer.write(line.toString());
            }
            
            writer.flush();
            return outputStream.toByteArray();
            
        } catch (IOException e) {
            throw new RuntimeException("导出CSV失败", e);
        }
    }

    @Override
    public Employee findByUsername(String username) {
        return employeeRepository.findByUsername(username).orElse(null);
    }

    @Override
    public Employee findByUsernameAndPassword(String username, String password) {
        return employeeRepository.findByUsernameAndPassword(username, password).orElse(null);
    }
} 
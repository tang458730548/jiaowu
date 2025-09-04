package com.jiaowu.service.impl.platform;

import com.jiaowu.entity.platform.TbJwEmployee;
import com.jiaowu.repository.platform.EmployeeRepository;
import com.jiaowu.service.platform.EmployeeService;
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

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public TbJwEmployee save(TbJwEmployee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public TbJwEmployee update(Long id, TbJwEmployee employee) {
        Optional<TbJwEmployee> optional = employeeRepository.findById(id);
        if (optional.isPresent()) {
            TbJwEmployee exist = optional.get();
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
    public TbJwEmployee findById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public List<TbJwEmployee> findAll() {
        return employeeRepository.findAll();
    }

    @Override
    public Page<TbJwEmployee> findAll(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }

    @Override
    public Page<TbJwEmployee> findAll(Pageable pageable, String username, String nickname) {
        return employeeRepository.findByUsernameAndNickname(username, nickname, pageable);
    }

    @Override
    public TbJwEmployee updateStatus(Long id, TbJwEmployee employee) {
        Optional<TbJwEmployee> optional = employeeRepository.findById(id);
        if (optional.isPresent()) {
            TbJwEmployee e = optional.get();
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
            List<TbJwEmployee> employees;
            if (StringUtils.isNotBlank(username) || StringUtils.isNotBlank(nickname)) {
                // 如果有查询条件，使用分页查询获取所有数据
                Page<TbJwEmployee> page = employeeRepository.findByUsernameAndNickname(username, nickname, Pageable.unpaged());
                employees = page.getContent();
            } else {
                employees = employeeRepository.findAll();
            }
            
            // 填充数据
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for (TbJwEmployee employee : employees) {
                String line = employee.getId() + "," +
                        employee.getUsername() + "," +
                        employee.getGender() + "," +
                        employee.getNickname() + "," +
                        employee.getTitle() + "," +
                        employee.getEmail() + "," +
                        employee.getEnrollYear() + "," +
                        employee.getStatus() + "," +
                        (employee.getCreateTime() != null ? sdf.format(employee.getCreateTime()) : "") + "," +
                        (employee.getUpdateTime() != null ? sdf.format(employee.getUpdateTime()) : "") +
                        "\n";
                writer.write(line);
            }
            
            writer.flush();
            return outputStream.toByteArray();
            
        } catch (IOException e) {
            throw new RuntimeException("导出CSV失败", e);
        }
    }

    @Override
    public TbJwEmployee findByUsername(String username) {
        return employeeRepository.findByUsername(username).orElse(null);
    }

    @Override
    public TbJwEmployee findByUsernameAndPassword(String username, String password) {
        return employeeRepository.findByUsernameAndPassword(username, password).orElse(null);
    }
} 
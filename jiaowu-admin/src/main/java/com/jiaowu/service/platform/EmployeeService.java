package com.jiaowu.service.platform;

import com.jiaowu.entity.platform.TbJwEmployee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface EmployeeService {
    TbJwEmployee save(TbJwEmployee employee);
    TbJwEmployee update(Long id, TbJwEmployee employee);
    void delete(Long id);
    TbJwEmployee findById(Long id);
    List<TbJwEmployee> findAll();
    Page<TbJwEmployee> findAll(Pageable pageable);
    Page<TbJwEmployee> findAll(Pageable pageable, String username, String nickname);
    TbJwEmployee updateStatus(Long id, TbJwEmployee employee);
    
    // 导出CSV
    byte[] exportToCsv(String username, String nickname);
    
    // 根据用户名查找职工
    TbJwEmployee findByUsername(String username);
    
    // 根据用户名和密码查找职工
    TbJwEmployee findByUsernameAndPassword(String username, String password);
}
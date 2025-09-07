package com.jiaowu.repository.platform;

import com.jiaowu.entity.platform.TbJwEmployee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<TbJwEmployee, Long> {
    // 根据用户名和昵称模糊查询
    @Query("SELECT e FROM TbJwEmployee e WHERE " +
           "(:username IS NULL OR e.username LIKE %:username%) AND " +
           "(:nickname IS NULL OR e.nickname LIKE %:nickname%) AND e.username <> 'admin'")
    Page<TbJwEmployee> findByUsernameAndNickname(@Param("username") String username,
                                                 @Param("nickname") String nickname,
                                                 Pageable pageable);
    
    // 根据用户名查找职工
    Optional<TbJwEmployee> findByUsername(String username);
    
    // 根据用户名和密码查找职工
    Optional<TbJwEmployee> findByUsernameAndPassword(String username, String password);
} 
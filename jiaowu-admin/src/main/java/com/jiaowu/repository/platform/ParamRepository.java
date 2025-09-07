package com.jiaowu.repository.platform;

import com.jiaowu.entity.platform.TbJwParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 系统参数数据访问层
 */
@Repository
public interface ParamRepository extends JpaRepository<TbJwParam, Long> {
    
    /**
     * 根据参数键查找参数
     */
    Optional<TbJwParam> findByParamKey(String paramKey);
    
    /**
     * 检查参数键是否存在（排除指定ID）
     */
    boolean existsByParamKeyAndIdNot(String paramKey, Long id);
    
    /**
     * 根据参数组查找参数列表
     */
    List<TbJwParam> findByParamGroup(String paramGroup);
    
    /**
     * 根据状态查找参数列表
     */
    List<TbJwParam> findByStatus(Integer status);
    
    /**
     * 根据参数类型查找参数列表
     */
    List<TbJwParam> findByParamType(String paramType);
    
    /**
     * 分页查询参数（支持多条件搜索）
     */
    @Query("SELECT p FROM TbJwParam p WHERE " +
           "(:paramName IS NULL OR p.paramName LIKE %:paramName%) AND " +
           "(:paramKey IS NULL OR p.paramKey LIKE %:paramKey%) AND " +
           "(:paramGroup IS NULL OR p.paramGroup = :paramGroup) AND " +
           "(:paramType IS NULL OR p.paramType = :paramType) AND " +
           "(:status IS NULL OR p.status = :status)")
    Page<TbJwParam> findParamsWithConditions(
            @Param("paramName") String paramName,
            @Param("paramKey") String paramKey,
            @Param("paramGroup") String paramGroup,
            @Param("paramType") String paramType,
            @Param("status") Integer status,
            Pageable pageable);
    
    /**
     * 根据参数组和状态查找参数
     */
    List<TbJwParam> findByParamGroupAndStatus(String paramGroup, Integer status);
    
    /**
     * 查找所有可编辑的参数
     */
    List<TbJwParam> findByIsEditableTrue();
    
    /**
     * 查找所有必填的参数
     */
    List<TbJwParam> findByIsRequiredTrue();
}

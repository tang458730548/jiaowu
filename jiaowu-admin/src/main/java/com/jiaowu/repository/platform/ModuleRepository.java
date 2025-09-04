package com.jiaowu.repository.platform;

import com.jiaowu.entity.platform.TbJwModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<TbJwModule, Long> {

    /**
     * 根据父级ID查询子模块
     */
    List<TbJwModule> findByParentIdOrderBySortOrderAsc(Long parentId);

    /**
     * 根据父级ID和状态查询子模块
     */
    List<TbJwModule> findByParentIdAndIsEnabledOrderBySortOrderAsc(Long parentId, Integer isEnabled);

    /**
     * 根据模块类型查询
     */
    List<TbJwModule> findByModuleTypeOrderBySortOrderAsc(Integer moduleType);

    /**
     * 根据模块编码查询
     */
    TbJwModule findByModuleCode(String moduleCode);

    /**
     * 根据权限标识查询
     */
    List<TbJwModule> findByPermission(String permission);

    /**
     * 查询所有启用的模块
     */
    List<TbJwModule> findByIsEnabledOrderBySortOrderAsc(Integer isEnabled);

    /**
     * 查询所有可见的模块
     */
    List<TbJwModule> findByIsVisibleOrderBySortOrderAsc(Integer isVisible);

    /**
     * 根据层级查询模块
     */
    List<TbJwModule> findByLevelOrderBySortOrderAsc(Integer level);

    /**
     * 查询指定模块的所有子模块（递归）
     */
    @Query("SELECT m FROM TbJwModule m WHERE m.parentId = :parentId AND m.isEnabled = 1 ORDER BY m.sortOrder")
    List<TbJwModule> findChildrenByParentId(@Param("parentId") Long parentId);

    /**
     * 查询模块的所有父级模块
     */
    @Query("SELECT m FROM TbJwModule m WHERE m.id IN " +
           "(SELECT DISTINCT m2.parentId FROM TbJwModule m2 WHERE m2.id = :moduleId AND m2.parentId > 0) " +
           "ORDER BY m.level")
    List<TbJwModule> findParentsByModuleId(@Param("moduleId") Long moduleId);

    /**
     * 检查是否存在子模块
     */
    @Query("SELECT COUNT(m) > 0 FROM TbJwModule m WHERE m.parentId = :parentId")
    boolean hasChildren(@Param("parentId") Long parentId);

    /**
     * 根据模块编码检查是否存在
     */
    boolean existsByModuleCode(String moduleCode);

    /**
     * 根据模块名称模糊查询
     */
    List<TbJwModule> findByModuleNameContainingOrderBySortOrderAsc(String moduleName);

    /**
     * 查询顶级模块
     */
    @Query("SELECT m FROM TbJwModule m WHERE m.parentId = 0 OR m.parentId IS NULL ORDER BY m.sortOrder")
    List<TbJwModule> findRootModules();

}
package com.jiaowu.service.platform;

import com.jiaowu.entity.platform.TbJwModule;

import java.util.List;

public interface ModuleService {

    /**
     * 保存模块
     */
    TbJwModule saveModule(TbJwModule module);

    /**
     * 根据ID查询模块
     */
    TbJwModule findById(Long id);

    /**
     * 根据模块编码查询模块
     */
    TbJwModule findByModuleCode(String moduleCode);

    /**
     * 查询所有模块
     */
    List<TbJwModule> findAll();

    /**
     * 查询所有启用的模块
     */
    List<TbJwModule> findAllEnabled();

    /**
     * 查询顶级模块
     */
    List<TbJwModule> findRootModules();

    /**
     * 根据父级ID查询子模块
     */
    List<TbJwModule> findChildrenByParentId(Long parentId);

    /**
     * 构建树形结构
     */
    List<TbJwModule> buildTree(List<TbJwModule> modules);

    /**
     * 构建指定模块的树形结构
     */
    List<TbJwModule> buildTreeByParentId(Long parentId);

    /**
     * 获取模块的所有子模块（包括子模块的子模块）
     */
    List<TbJwModule> getAllChildren(Long moduleId);

    /**
     * 获取模块的所有父级模块
     */
    List<TbJwModule> getAllParents(Long moduleId);

    /**
     * 检查模块是否有子模块
     */
    boolean hasChildren(Long moduleId);

    /**
     * 检查模块编码是否存在
     */
    boolean existsByModuleCode(String moduleCode);

    /**
     * 删除模块（如果有子模块则不允许删除）
     */
    boolean deleteModule(Long id);

    /**
     * 批量删除模块
     */
    boolean deleteModules(List<Long> ids);

    /**
     * 启用/禁用模块
     */
    boolean toggleModuleStatus(Long id, Integer status);

    /**
     * 显示/隐藏模块
     */
    boolean toggleModuleVisibility(Long id, Integer visibility);

    /**
     * 更新模块排序
     */
    boolean updateSortOrder(Long id, Integer sortOrder);

    /**
     * 根据用户ID查询有权限的模块
     */
    List<TbJwModule> findModulesByUserId(Long userId);

    /**
     * 根据用户ID查询有权限的模块树
     */
    List<TbJwModule> findModuleTreeByUserId(Long userId);

    /**
     * 根据模块名称模糊查询
     */
    List<TbJwModule> findByModuleName(String moduleName);

    /**
     * 根据模块类型查询
     */
    List<TbJwModule> findByModuleType(Integer moduleType);

    /**
     * 验证模块数据
     */
    boolean validateModule(TbJwModule module);

    /**
     * 检查模块路径是否重复
     */
    boolean isPathDuplicate(String path, Long excludeId);
} 
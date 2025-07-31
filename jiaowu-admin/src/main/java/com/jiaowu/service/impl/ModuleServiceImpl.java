package com.jiaowu.service.impl;

import com.jiaowu.entity.Module;
import com.jiaowu.repository.ModuleRepository;
import com.jiaowu.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public Module saveModule(Module module) {
        if (module.getId() == null) {
            // 新增模块
            if (module.getParentId() == null) {
                module.setParentId(0L);
                module.setLevel(1);
            } else {
                // 设置层级
                Module parent = moduleRepository.findById(module.getParentId()).orElse(null);
                if (parent != null) {
                    module.setLevel(parent.getLevel() + 1);
                } else {
                    module.setLevel(1);
                }
            }
            
            // 设置默认值
            if (module.getModuleType() == null) {
                module.setModuleType(Module.TYPE_MENU);
            }
            if (module.getIsVisible() == null) {
                module.setIsVisible(Module.STATUS_VISIBLE);
            }
            if (module.getIsEnabled() == null) {
                module.setIsEnabled(Module.STATUS_ENABLED);
            }
            if (module.getSortOrder() == null) {
                module.setSortOrder(0);
            }
        }
        
        return moduleRepository.save(module);
    }

    @Override
    public Module findById(Long id) {
        return moduleRepository.findById(id).orElse(null);
    }

    @Override
    public Module findByModuleCode(String moduleCode) {
        return moduleRepository.findByModuleCode(moduleCode);
    }

    @Override
    public List<Module> findAll() {
        return moduleRepository.findAll();
    }

    @Override
    public List<Module> findAllEnabled() {
        return moduleRepository.findByIsEnabledOrderBySortOrderAsc(Module.STATUS_ENABLED);
    }

    @Override
    public List<Module> findRootModules() {
        return moduleRepository.findRootModules();
    }

    @Override
    public List<Module> findChildrenByParentId(Long parentId) {
        return moduleRepository.findChildrenByParentId(parentId);
    }

    @Override
    public List<Module> buildTree(List<Module> modules) {
        if (modules == null || modules.isEmpty()) {
            return new ArrayList<>();
        }

        // 创建ID到模块的映射
        Map<Long, Module> moduleMap = modules.stream()
                .collect(Collectors.toMap(Module::getId, module -> module));

        List<Module> rootModules = new ArrayList<>();

        for (Module module : modules) {
            if (module.isRoot()) {
                rootModules.add(module);
            } else {
                Module parent = moduleMap.get(module.getParentId());
                if (parent != null) {
                    if (parent.getChildren() == null) {
                        parent.setChildren(new ArrayList<>());
                    }
                    parent.getChildren().add(module);
                }
            }
        }

        // 递归设置hasChildren属性
        setHasChildren(rootModules);

        return rootModules;
    }

    @Override
    public List<Module> buildTreeByParentId(Long parentId) {
        List<Module> allModules = moduleRepository.findAll();
        List<Module> targetModules = new ArrayList<>();
        
        // 获取指定父级下的所有模块
        collectModulesByParentId(allModules, parentId, targetModules);
        
        return buildTree(targetModules);
    }

    @Override
    public List<Module> getAllChildren(Long moduleId) {
        List<Module> allModules = moduleRepository.findAll();
        List<Module> children = new ArrayList<>();
        
        collectChildren(allModules, moduleId, children);
        
        return children;
    }

    @Override
    public List<Module> getAllParents(Long moduleId) {
        return moduleRepository.findParentsByModuleId(moduleId);
    }

    @Override
    public boolean hasChildren(Long moduleId) {
        return moduleRepository.hasChildren(moduleId);
    }

    @Override
    public boolean existsByModuleCode(String moduleCode) {
        return moduleRepository.existsByModuleCode(moduleCode);
    }

    @Override
    public boolean deleteModule(Long id) {
        // 检查是否有子模块
        if (hasChildren(id)) {
            return false;
        }
        
        moduleRepository.deleteById(id);
        return true;
    }

    @Override
    public boolean deleteModules(List<Long> ids) {
        for (Long id : ids) {
            if (hasChildren(id)) {
                return false;
            }
        }
        
        moduleRepository.deleteAllById(ids);
        return true;
    }

    @Override
    public boolean toggleModuleStatus(Long id, Integer status) {
        Module module = findById(id);
        if (module != null) {
            module.setIsEnabled(status);
            moduleRepository.save(module);
            return true;
        }
        return false;
    }

    @Override
    public boolean toggleModuleVisibility(Long id, Integer visibility) {
        Module module = findById(id);
        if (module != null) {
            module.setIsVisible(visibility);
            moduleRepository.save(module);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateSortOrder(Long id, Integer sortOrder) {
        Module module = findById(id);
        if (module != null) {
            module.setSortOrder(sortOrder);
            moduleRepository.save(module);
            return true;
        }
        return false;
    }

    @Override
    public List<Module> findModulesByUserId(Long userId) {
        return null;
    }

    @Override
    public List<Module> findModuleTreeByUserId(Long userId) {
        List<Module> modules = findModulesByUserId(userId);
        return buildTree(modules);
    }

    @Override
    public List<Module> findByModuleName(String moduleName) {
        if (StringUtils.hasText(moduleName)) {
            return moduleRepository.findByModuleNameContainingOrderBySortOrderAsc(moduleName);
        }
        return new ArrayList<>();
    }

    @Override
    public List<Module> findByModuleType(Integer moduleType) {
        return moduleRepository.findByModuleTypeOrderBySortOrderAsc(moduleType);
    }

    @Override
    public boolean validateModule(Module module) {
        if (module == null) {
            return false;
        }
        
        // 验证必填字段
        if (!StringUtils.hasText(module.getModuleName()) || 
            !StringUtils.hasText(module.getModuleCode())) {
            return false;
        }
        
        // 验证模块编码唯一性
        Module existingModule = findByModuleCode(module.getModuleCode());
        if (existingModule != null && !existingModule.getId().equals(module.getId())) {
            return false;
        }
        
        // 验证父级模块存在
        if (module.getParentId() != null && module.getParentId() > 0) {
            Module parent = findById(module.getParentId());
            if (parent == null) {
                return false;
            }
        }
        
        return true;
    }

    @Override
    public boolean isPathDuplicate(String path, Long excludeId) {
        if (!StringUtils.hasText(path)) {
            return false;
        }
        
        List<Module> modules = moduleRepository.findAll();
        return modules.stream()
                .anyMatch(module -> path.equals(module.getPath()) && 
                        (excludeId == null || !excludeId.equals(module.getId())));
    }

    /**
     * 递归设置hasChildren属性
     */
    private void setHasChildren(List<Module> modules) {
        for (Module module : modules) {
            if (module.getChildren() != null && !module.getChildren().isEmpty()) {
                module.setHasChildren(true);
                setHasChildren(module.getChildren());
            } else {
                module.setHasChildren(false);
            }
        }
    }

    /**
     * 递归收集指定父级下的所有模块
     */
    private void collectModulesByParentId(List<Module> allModules, Long parentId, List<Module> result) {
        for (Module module : allModules) {
            if (Objects.equals(module.getParentId(), parentId)) {
                result.add(module);
                collectModulesByParentId(allModules, module.getId(), result);
            }
        }
    }

    /**
     * 递归收集所有子模块
     */
    private void collectChildren(List<Module> allModules, Long parentId, List<Module> children) {
        for (Module module : allModules) {
            if (Objects.equals(module.getParentId(), parentId)) {
                children.add(module);
                collectChildren(allModules, module.getId(), children);
            }
        }
    }
} 
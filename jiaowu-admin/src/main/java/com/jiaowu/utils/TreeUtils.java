package com.jiaowu.utils;

import com.jiaowu.entity.platform.TbJwModule;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 树形结构工具类
 */
public class TreeUtils {

    /**
     * 构建树形结构
     */
    public static List<TbJwModule> buildTree(List<TbJwModule> modules) {
        if (modules == null || modules.isEmpty()) {
            return new ArrayList<>();
        }

        // 创建ID到模块的映射
        Map<Long, TbJwModule> moduleMap = modules.stream()
                .collect(Collectors.toMap(TbJwModule::getId, module -> module));

        List<TbJwModule> rootModules = new ArrayList<>();

        for (TbJwModule module : modules) {
            if (module.isRoot()) {
                rootModules.add(module);
            } else {
                TbJwModule parent = moduleMap.get(module.getParentId());
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

    /**
     * 递归设置hasChildren属性
     */
    private static void setHasChildren(List<TbJwModule> modules) {
        for (TbJwModule module : modules) {
            if (module.getChildren() != null && !module.getChildren().isEmpty()) {
                module.setHasChildren(true);
                setHasChildren(module.getChildren());
            } else {
                module.setHasChildren(false);
            }
        }
    }

    /**
     * 获取所有子模块ID（包括子模块的子模块）
     */
    public static List<Long> getAllChildrenIds(List<TbJwModule> modules, Long parentId) {
        List<Long> childrenIds = new ArrayList<>();
        collectChildrenIds(modules, parentId, childrenIds);
        return childrenIds;
    }

    /**
     * 递归收集所有子模块ID
     */
    private static void collectChildrenIds(List<TbJwModule> modules, Long parentId, List<Long> childrenIds) {
        for (TbJwModule module : modules) {
            if (Objects.equals(module.getParentId(), parentId)) {
                childrenIds.add(module.getId());
                collectChildrenIds(modules, module.getId(), childrenIds);
            }
        }
    }

    /**
     * 获取模块的所有父级模块
     */
    public static List<TbJwModule> getAllParents(List<TbJwModule> modules, Long moduleId) {
        List<TbJwModule> parents = new ArrayList<>();
        TbJwModule current = findModuleById(modules, moduleId);
        
        while (current != null && !current.isRoot()) {
            TbJwModule parent = findModuleById(modules, current.getParentId());
            if (parent != null) {
                parents.add(0, parent); // 插入到列表开头，保持层级顺序
                current = parent;
            } else {
                break;
            }
        }
        
        return parents;
    }

    /**
     * 根据ID查找模块
     */
    private static TbJwModule findModuleById(List<TbJwModule> modules, Long id) {
        return modules.stream()
                .filter(module -> Objects.equals(module.getId(), id))
                .findFirst()
                .orElse(null);
    }

    /**
     * 扁平化树形结构
     */
    public static List<TbJwModule> flattenTree(List<TbJwModule> tree) {
        List<TbJwModule> flatList = new ArrayList<>();
        flattenTreeRecursive(tree, flatList);
        return flatList;
    }

    /**
     * 递归扁平化树形结构
     */
    private static void flattenTreeRecursive(List<TbJwModule> modules, List<TbJwModule> result) {
        for (TbJwModule module : modules) {
            result.add(module);
            if (module.getChildren() != null && !module.getChildren().isEmpty()) {
                flattenTreeRecursive(module.getChildren(), result);
            }
        }
    }

    /**
     * 根据层级过滤模块
     */
    public static List<TbJwModule> filterByLevel(List<TbJwModule> modules, int level) {
        return modules.stream()
                .filter(module -> Objects.equals(module.getLevel(), level))
                .collect(Collectors.toList());
    }

    /**
     * 根据模块类型过滤
     */
    public static List<TbJwModule> filterByType(List<TbJwModule> modules, Integer moduleType) {
        return modules.stream()
                .filter(module -> Objects.equals(module.getModuleType(), moduleType))
                .collect(Collectors.toList());
    }

    /**
     * 根据状态过滤模块
     */
    public static List<TbJwModule> filterByStatus(List<TbJwModule> modules, Integer status) {
        return modules.stream()
                .filter(module -> Objects.equals(module.getIsEnabled(), status))
                .collect(Collectors.toList());
    }

    /**
     * 根据可见性过滤模块
     */
    public static List<TbJwModule> filterByVisibility(List<TbJwModule> modules, Integer visibility) {
        return modules.stream()
                .filter(module -> Objects.equals(module.getIsVisible(), visibility))
                .collect(Collectors.toList());
    }

    /**
     * 获取模块的完整路径（从根到当前模块）
     */
    public static String getModulePath(List<TbJwModule> modules, Long moduleId) {
        List<TbJwModule> parents = getAllParents(modules, moduleId);
        TbJwModule current = findModuleById(modules, moduleId);
        
        StringBuilder path = new StringBuilder();
        
        // 添加父级路径
        for (TbJwModule parent : parents) {
            path.append(parent.getModuleName()).append(" > ");
        }
        
        // 添加当前模块
        if (current != null) {
            path.append(current.getModuleName());
        }
        
        return path.toString();
    }

    /**
     * 检查模块是否为叶子节点
     */
    public static boolean isLeafNode(List<TbJwModule> modules, Long moduleId) {
        return modules.stream()
                .noneMatch(module -> Objects.equals(module.getParentId(), moduleId));
    }

    /**
     * 获取模块的深度
     */
    public static int getModuleDepth(List<TbJwModule> modules, Long moduleId) {
        List<TbJwModule> parents = getAllParents(modules, moduleId);
        return parents.size();
    }

    /**
     * 获取模块的所有兄弟节点
     */
    public static List<TbJwModule> getSiblings(List<TbJwModule> modules, Long moduleId) {
        TbJwModule current = findModuleById(modules, moduleId);
        if (current == null || current.isRoot()) {
            return new ArrayList<>();
        }
        
        return modules.stream()
                .filter(module -> Objects.equals(module.getParentId(), current.getParentId()))
                .filter(module -> !Objects.equals(module.getId(), moduleId))
                .collect(Collectors.toList());
    }

    /**
     * 检查是否为有效的树形结构（无循环引用）
     */
    public static boolean isValidTree(List<TbJwModule> modules) {
        Set<Long> visited = new HashSet<>();
        Set<Long> recursionStack = new HashSet<>();
        
        for (TbJwModule module : modules) {
            if (hasCycle(module.getId(), modules, visited, recursionStack)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * 检查是否存在循环引用
     */
    private static boolean hasCycle(Long moduleId, List<TbJwModule> modules, Set<Long> visited, Set<Long> recursionStack) {
        if (recursionStack.contains(moduleId)) {
            return true;
        }
        
        if (visited.contains(moduleId)) {
            return false;
        }
        
        visited.add(moduleId);
        recursionStack.add(moduleId);
        
        TbJwModule module = findModuleById(modules, moduleId);
        if (module != null && !module.isRoot()) {
            if (hasCycle(module.getParentId(), modules, visited, recursionStack)) {
                return true;
            }
        }
        
        recursionStack.remove(moduleId);
        return false;
    }
} 
package com.jiaowu.controller;

import com.jiaowu.entity.Module;
import com.jiaowu.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/modules")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    /**
     * 获取所有模块
     */
    @GetMapping("getAllModules")
    public ResponseEntity<Map<String, Object>> getAllModules() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Module> modules = moduleService.findAll();
            response.put("success", true);
            response.put("data", modules);
            response.put("message", "获取模块列表成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取模块列表失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 获取模块树形结构
     */
    @GetMapping("/tree")
    public ResponseEntity<Map<String, Object>> getModuleTree() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Module> modules = moduleService.findAll();
            List<Module> tree = moduleService.buildTree(modules);
            response.put("success", true);
            response.put("data", tree);
            response.put("message", "获取模块树成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取模块树失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 根据ID获取模块
     */
    @GetMapping("/get/{id}")
    public ResponseEntity<Map<String, Object>> getModuleById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Module module = moduleService.findById(id);
            if (module != null) {
                response.put("success", true);
                response.put("data", module);
                response.put("message", "获取模块成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "模块不存在");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取模块失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 创建模块
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createModule(@RequestBody Module module) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 验证模块数据
            if (!moduleService.validateModule(module)) {
                response.put("success", false);
                response.put("message", "模块数据验证失败");
                return ResponseEntity.badRequest().body(response);
            }

            Module savedModule = moduleService.saveModule(module);
            response.put("success", true);
            response.put("data", savedModule);
            response.put("message", "创建模块成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "创建模块失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 更新模块
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateModule(@PathVariable Long id, @RequestBody Module module) {
        Map<String, Object> response = new HashMap<>();
        try {
            Module existingModule = moduleService.findById(id);
            if (existingModule == null) {
                response.put("success", false);
                response.put("message", "模块不存在");
                return ResponseEntity.notFound().build();
            }

            module.setId(id);
            
            // 验证模块数据
            if (!moduleService.validateModule(module)) {
                response.put("success", false);
                response.put("message", "模块数据验证失败");
                return ResponseEntity.badRequest().body(response);
            }

            Module updatedModule = moduleService.saveModule(module);
            response.put("success", true);
            response.put("data", updatedModule);
            response.put("message", "更新模块成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新模块失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 删除模块
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteModule(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean deleted = moduleService.deleteModule(id);
            if (deleted) {
                response.put("success", true);
                response.put("message", "删除模块成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "删除模块失败，该模块下有子模块");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "删除模块失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 批量删除模块
     */
    @DeleteMapping("/batch/delete")
    public ResponseEntity<Map<String, Object>> deleteModules(@RequestBody List<Long> ids) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean deleted = moduleService.deleteModules(ids);
            if (deleted) {
                response.put("success", true);
                response.put("message", "批量删除模块成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "批量删除模块失败，某些模块下有子模块");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "批量删除模块失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 启用/禁用模块
     */
    @PutMapping("/toggleModuleStatus/{id}/status")
    public ResponseEntity<Map<String, Object>> toggleModuleStatus(@PathVariable Long id, @RequestParam Integer status) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean updated = moduleService.toggleModuleStatus(id, status);
            if (updated) {
                response.put("success", true);
                response.put("message", "更新模块状态成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "更新模块状态失败，模块不存在");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新模块状态失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 显示/隐藏模块
     */
    @PutMapping("/toggleModuleVisibility/{id}/visibility")
    public ResponseEntity<Map<String, Object>> toggleModuleVisibility(@PathVariable Long id, @RequestParam Integer visibility) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean updated = moduleService.toggleModuleVisibility(id, visibility);
            if (updated) {
                response.put("success", true);
                response.put("message", "更新模块可见性成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "更新模块可见性失败，模块不存在");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新模块可见性失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 更新模块排序
     */
    @PutMapping("/updateModuleSort/{id}/sort")
    public ResponseEntity<Map<String, Object>> updateModuleSort(@PathVariable Long id, @RequestParam Integer sortOrder) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean updated = moduleService.updateSortOrder(id, sortOrder);
            if (updated) {
                response.put("success", true);
                response.put("message", "更新模块排序成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "更新模块排序失败，模块不存在");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "更新模块排序失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 根据父级ID获取子模块
     */
    @GetMapping("/getChildrenByParentId/children/{parentId}")
    public ResponseEntity<Map<String, Object>> getChildrenByParentId(@PathVariable Long parentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Module> children = moduleService.findChildrenByParentId(parentId);
            response.put("success", true);
            response.put("data", children);
            response.put("message", "获取子模块成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取子模块失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 根据模块名称搜索
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchModules(@RequestParam String moduleName) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Module> modules = moduleService.findByModuleName(moduleName);
            response.put("success", true);
            response.put("data", modules);
            response.put("message", "搜索模块成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "搜索模块失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 根据模块类型查询
     */
    @GetMapping("/type/{moduleType}")
    public ResponseEntity<Map<String, Object>> getModulesByType(@PathVariable Integer moduleType) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Module> modules = moduleService.findByModuleType(moduleType);
            response.put("success", true);
            response.put("data", modules);
            response.put("message", "获取模块成功");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "获取模块失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 检查模块编码是否存在
     */
    @GetMapping("/check-code")
    public ResponseEntity<Map<String, Object>> checkModuleCode(@RequestParam String moduleCode) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean exists = moduleService.existsByModuleCode(moduleCode);
            response.put("success", true);
            response.put("exists", exists);
            response.put("message", exists ? "模块编码已存在" : "模块编码可用");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "检查模块编码失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 
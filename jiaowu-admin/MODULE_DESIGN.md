# 教务模块表设计文档

## 概述

`tb_jw_module` 表是一个用于后台模块管理的树形结构表，支持多级菜单、权限控制、路由管理等功能。

## 表结构设计

### 核心字段

| 字段名 | 类型 | 长度 | 是否必填 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | BIGINT | 20 | 是 | AUTO_INCREMENT | 主键ID |
| parent_id | BIGINT | 20 | 否 | 0 | 父级模块ID，0表示顶级模块 |
| module_name | VARCHAR | 100 | 是 | - | 模块名称 |
| module_code | VARCHAR | 50 | 是 | - | 模块编码，唯一标识 |
| module_type | TINYINT | 1 | 否 | 1 | 模块类型：1-菜单 2-按钮 3-页面 |
| icon | VARCHAR | 100 | 否 | NULL | 图标 |
| path | VARCHAR | 200 | 否 | NULL | 路由路径 |
| component | VARCHAR | 200 | 否 | NULL | 前端组件路径 |
| permission | VARCHAR | 100 | 否 | NULL | 权限标识 |
| sort_order | INT | 11 | 否 | 0 | 排序号 |
| level | INT | 11 | 否 | 1 | 层级，从1开始 |
| is_visible | TINYINT | 1 | 否 | 1 | 是否可见：1-可见 0-隐藏 |
| is_enabled | TINYINT | 1 | 否 | 1 | 是否启用：1-启用 0-禁用 |
| description | VARCHAR | 500 | 否 | NULL | 模块描述 |

### 审计字段

| 字段名 | 类型 | 长度 | 是否必填 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| create_time | DATETIME | - | 否 | CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | - | 否 | CURRENT_TIMESTAMP | 更新时间 |
| create_by | BIGINT | 20 | 否 | NULL | 创建人ID |
| update_by | BIGINT | 20 | 否 | NULL | 更新人ID |

### 索引设计

- **主键索引**: `PRIMARY KEY (id)`
- **唯一索引**: `UNIQUE KEY uk_module_code (module_code)`
- **普通索引**: 
  - `KEY idx_parent_id (parent_id)` - 父级ID查询优化
  - `KEY idx_sort_order (sort_order)` - 排序查询优化
  - `KEY idx_level (level)` - 层级查询优化

## 功能特性

### 1. 树形结构支持
- 支持无限级嵌套
- 自动计算层级
- 防止循环引用
- 支持树形查询和构建

### 2. 模块类型管理
- **菜单类型 (1)**: 用于导航菜单
- **按钮类型 (2)**: 用于权限控制
- **页面类型 (3)**: 用于页面路由

### 3. 权限控制
- 基于权限标识的访问控制
- 支持细粒度权限管理
- 与角色权限系统集成

### 4. 状态管理
- 启用/禁用状态
- 可见/隐藏状态
- 支持批量状态切换

### 5. 排序功能
- 支持自定义排序
- 同级模块按排序号显示
- 支持拖拽排序

## API接口

### 基础CRUD操作
- `GET /api/modules` - 获取所有模块
- `GET /api/modules/{id}` - 根据ID获取模块
- `POST /api/modules` - 创建模块
- `PUT /api/modules/{id}` - 更新模块
- `DELETE /api/modules/{id}` - 删除模块

### 树形结构操作
- `GET /api/modules/tree` - 获取模块树形结构
- `GET /api/modules/children/{parentId}` - 获取子模块

### 状态管理
- `PUT /api/modules/{id}/status` - 启用/禁用模块
- `PUT /api/modules/{id}/visibility` - 显示/隐藏模块
- `PUT /api/modules/{id}/sort` - 更新排序

### 查询功能
- `GET /api/modules/search` - 根据名称搜索
- `GET /api/modules/type/{moduleType}` - 根据类型查询
- `GET /api/modules/check-code` - 检查编码是否存在

## 使用示例

### 1. 创建顶级模块
```json
{
  "moduleName": "系统管理",
  "moduleCode": "system",
  "moduleType": 1,
  "icon": "setting",
  "path": "/system",
  "component": "Layout",
  "permission": "system",
  "sortOrder": 1,
  "description": "系统管理模块"
}
```

### 2. 创建子模块
```json
{
  "parentId": 1,
  "moduleName": "用户管理",
  "moduleCode": "system:user",
  "moduleType": 1,
  "icon": "user",
  "path": "/system/user",
  "component": "system/user/index",
  "permission": "system:user:list",
  "sortOrder": 1,
  "description": "用户管理"
}
```

### 3. 创建按钮权限
```json
{
  "parentId": 2,
  "moduleName": "用户查询",
  "moduleCode": "system:user:query",
  "moduleType": 2,
  "permission": "system:user:query",
  "sortOrder": 1,
  "description": "用户查询权限"
}
```

## 数据完整性

### 约束条件
1. **模块编码唯一性**: 确保模块编码全局唯一
2. **父级模块存在性**: 确保父级模块存在
3. **层级一致性**: 自动计算和维护层级关系
4. **删除保护**: 有子模块的模块不允许删除

### 验证规则
1. 模块名称和编码不能为空
2. 模块编码格式验证
3. 路径格式验证
4. 权限标识格式验证

## 性能优化

### 查询优化
1. 使用合适的索引
2. 分页查询支持
3. 缓存机制
4. 懒加载子模块

### 树形构建优化
1. 一次性查询所有数据
2. 内存中构建树形结构
3. 避免N+1查询问题

## 扩展性

### 未来扩展
1. 支持模块模板
2. 支持模块导入导出
3. 支持模块版本管理
4. 支持模块依赖关系
5. 支持模块权限继承

### 集成能力
1. 与前端路由系统集成
2. 与权限框架集成
3. 与菜单组件集成
4. 与缓存系统集成

## 注意事项

1. **循环引用检查**: 在创建和更新模块时检查循环引用
2. **权限验证**: 确保用户有相应权限进行操作
3. **数据一致性**: 维护父子关系的完整性
4. **性能考虑**: 大量数据时的查询性能优化
5. **安全考虑**: 防止SQL注入和XSS攻击 
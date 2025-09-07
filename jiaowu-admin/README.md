# 教务管理系统后端服务

基于 Spring Boot 2.7.18 的教务管理系统后端服务，提供职工管理、系统参数、模块（菜单/权限）管理、登录与验证码等接口，采用无状态 JWT 鉴权。

## 技术栈

- **Spring Boot**: 2.7.18
- **Spring Web / Validation**
- **Spring Data JPA**
- **Spring Security**（JWT）
- **MySQL**
- **Maven**
- **Java**: 8+

## 运行配置

- **服务端口**: 9901
- **上下文路径**: `/api`
- **JPA**: `ddl-auto=update`, `show-sql=true`
- **日志级别**: 启用 Security/SQL 调试日志（见 `application.yml`）
- **CORS**: 允许任意源、方法、头，支持凭证

示例（节选）：

```yaml
server:
  port: 9901
  servlet:
    context-path: /api
spring:
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
logging:
  level:
    org.springframework.security: DEBUG
    org.hibernate.SQL: debug
```

> 提示：请在 `application.yml` 补充 JWT 配置：`jwt.secret`、`jwt.expiration`、`jwt.refresh-expiration`。

## 项目结构

```
src/main/java/com/jiaowu/
├── JiaowuApplication.java              # 启动类
├── common/                             # 通用组件
│   ├── constant/HttpResultConstant.java
│   └── exception/                      # 全局异常 & 权限异常
│       ├── CustomAccessDeniedHandler.java
│       └── GlobalExceptionHandler.java
├── config/                             # 配置类
│   ├── CorsConfig.java
│   ├── JpaConfig.java
│   └── WebSecurityConfig.java          # Spring Security + JWT 过滤器
├── controller/
│   ├── TestController.java             # 健康检查
│   └── platform/
│       ├── LoginController.java        # 登录/验证码/首页参数
│       ├── EmployeeController.java     # 职工管理
│       ├── ModuleController.java       # 模块（菜单/权限）管理
│       └── ParamController.java        # 系统参数管理
├── entity/
│   └── platform/
│       ├── TbJwEmployee.java
│       ├── TbJwModule.java
│       ├── TbJwParam.java
│       └── TbJwVerificationCode.java
├── filter/
│   └── JwtRequestFilter.java           # JWT 请求过滤器
├── repository/
│   └── platform/                       # JPA 仓储
├── request/                            # 请求 DTO
├── response/                           # 响应 DTO（ResultResponse）
├── security/
│   ├── CustomUserDetails.java
│   └── UserDetailsServiceImpl.java
└── service/
    ├── platform/                       # 服务接口
    └── impl/platform/                  # 服务实现
```

## 安全与鉴权

- 无状态会话（`SessionCreationPolicy.STATELESS`）
- JWT Bearer Token：所有受保护接口需携带 `Authorization: Bearer <token>`
- 免认证路径：`/verification/generate`、`/login/**`
- 过滤器链：`JwtRequestFilter` 负责提取/校验 Token，并写入 `SecurityContext`

JWT 配置键（需在 `application.yml` 中提供）：

- `jwt.secret`: HS256 签名密钥（建议较长随机字符串）
- `jwt.expiration`: 访问 Token 有效期（毫秒）
- `jwt.refresh-expiration`: 刷新 Token 有效期（毫秒）

## 快速开始

### 环境要求

- JDK 8+
- Maven 3.6+
- MySQL 5.7+/8.x

### 数据库准备

```sql
CREATE DATABASE jiaowu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 配置数据库与 JWT

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/jiaowu?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
jwt:
  secret: your_long_random_secret
  expiration: 86400000           # 24h
  refresh-expiration: 2592000000 # 30d
```

### 启动

```bash
mvn clean spring-boot:run
```

或在 IDE 运行 `JiaowuApplication`。

### 访问地址

- 服务地址: `http://localhost:9901/api`
- 健康检查: `GET /api/test/health`

## 主要接口概览

### 登录与验证码

- 生成验证码：`POST /api/verification/generate`
  - 返回：`code`、`sessionId`
- 职工登录：`POST /api/login/employee`
  - 入参：`username`、`password`、`verificationCode`（配合 `sessionId` 或 `username`）
  - 返回：`userDetails`、`accessToken`、`refreshToken`
- 登出：`POST /api/login/logout`
- 登录页信息：`GET /api/login/getIndexPageInfos`（读取系统参数）

### 职工管理（需登录）

- 新增：`POST /api/employees/create`
- 修改：`POST /api/employees/update/{id}`
- 修改状态：`POST /api/employees/updateStatus/{id}`
- 删除：`POST /api/employees/delete/{id}`
- 详情：`GET /api/employees/get/{id}`
- 分页查询：`POST /api/employees/query`（支持排序/条件）
- 导出 CSV：`POST /api/employees/export`

### 模块/菜单管理（需登录）

- 全部：`GET /api/modules/getAllModules`
- 树结构：`GET /api/modules/tree`
- 详情：`GET /api/modules/get/{id}`
- 新增：`POST /api/modules/create`
- 更新：`PUT /api/modules/update/{id}`
- 删除：`DELETE /api/modules/delete/{id}`（存在子节点时禁止）
- 批量删除：`DELETE /api/modules/batch/delete`
- 启用/禁用：`PUT /api/modules/toggleModuleStatus/{id}/status?status=1|0`
- 显示/隐藏：`PUT /api/modules/toggleModuleVisibility/{id}/visibility?visibility=1|0`
- 更新排序：`PUT /api/modules/updateModuleSort/{id}/sort?sortOrder=...`
- 根据父级取子节点：`GET /api/modules/getChildrenByParentId/children/{parentId}`
- 名称搜索：`GET /api/modules/search?moduleName=...`
- 类型查询：`GET /api/modules/type/{moduleType}`（1菜单/2按钮/3页面）
- 编码查重：`GET /api/modules/check-code?moduleCode=...`

### 系统参数（需登录）

- 新增：`POST /api/params/create`
- 更新：`POST /api/params/update/{id}`
- 修改状态：`POST /api/params/updateStatus/{id}`
- 删除：`POST /api/params/delete/{id}`
- 详情：`GET /api/params/get/{id}`
- 分页查询：`POST /api/params/query`
- 导出 CSV：`POST /api/params/export`

## 统一响应格式

所有接口返回 `ResultResponse<T>`：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

## 开发说明

- 新增实体：在 `entity` 新建 → `repository` 定义仓储 → `service` 定义接口与实现 → `controller` 暴露接口
- 数据库结构：JPA 自动维护（`ddl-auto=update`）。生产环境建议使用迁移工具（如 Flyway/Liquibase）。
- 日志：可在 `application.yml` 调整日志级别与输出格式。

## 许可证

MIT License 
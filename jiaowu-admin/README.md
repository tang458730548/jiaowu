# 教务管理系统后端服务

基于Spring Boot 2.7.18开发的教务管理系统后端服务。

## 技术栈

- **Spring Boot**: 2.7.18
- **Spring Data JPA**: 数据访问层
- **MySQL**: 数据库
- **Maven**: 项目管理工具
- **Lombok**: 简化代码
- **Java**: 8+

## 项目结构

```
src/main/java/com/jiaowu/
├── JiaowuApplication.java          # 主启动类
├── common/                         # 通用组件
│   ├── Result.java                # 统一响应结果
│   └── GlobalExceptionHandler.java # 全局异常处理
├── config/                         # 配置类
│   └── JpaConfig.java             # JPA配置
├── controller/                     # 控制器层
│   ├── TestController.java        # 测试控制器
│   └── UserController.java        # 用户控制器
├── entity/                         # 实体类
│   └── User.java                  # 用户实体
├── repository/                     # 数据访问层
│   └── UserRepository.java        # 用户数据访问接口
└── service/                        # 服务层
    ├── UserService.java           # 用户服务接口
    └── impl/
        └── UserServiceImpl.java   # 用户服务实现
```

## 快速开始

### 环境要求

- JDK 8+
- Maven 3.6+
- MySQL 5.7+

### 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE jiaowu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改配置文件 `src/main/resources/application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/jiaowu?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
```

### 运行项目

1. 克隆项目到本地
2. 进入项目目录
3. 运行以下命令：

```bash
# 编译项目
mvn clean compile

# 运行项目
mvn spring-boot:run
```

或者直接运行主类 `JiaowuApplication.java`

### 访问地址

- 服务地址: http://localhost:8080/api
- 健康检查: http://localhost:8080/api/test/health
- 欢迎页面: http://localhost:8080/api/test/welcome

## API接口

### 用户管理接口

#### 创建用户
```
POST /api/users
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456",
  "realName": "测试用户",
  "email": "test@example.com",
  "phone": "13800138000",
  "role": "STUDENT"
}
```

#### 获取用户列表
```
GET /api/users
```

#### 分页查询用户
```
GET /api/users/page?page=0&size=10&sortBy=id&sortDir=desc
```

#### 根据ID获取用户
```
GET /api/users/{id}
```

#### 更新用户信息
```
PUT /api/users/{id}
Content-Type: application/json

{
  "realName": "新姓名",
  "email": "newemail@example.com",
  "phone": "13900139000",
  "role": "TEACHER"
}
```

#### 删除用户
```
DELETE /api/users/{id}
```

#### 搜索用户
```
GET /api/users/search?keyword=关键词
```

#### 检查用户名是否存在
```
GET /api/users/check-username?username=testuser
```

#### 检查邮箱是否存在
```
GET /api/users/check-email?email=test@example.com
```

## 用户角色

- `ADMIN`: 管理员
- `TEACHER`: 教师
- `STUDENT`: 学生

## 用户状态

- `ACTIVE`: 正常
- `INACTIVE`: 禁用
- `DELETED`: 已删除

## 响应格式

所有API接口都使用统一的响应格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    // 具体数据
  }
}
```

## 开发说明

### 添加新的实体类

1. 在 `entity` 包下创建实体类
2. 在 `repository` 包下创建对应的Repository接口
3. 在 `service` 包下创建服务接口和实现类
4. 在 `controller` 包下创建控制器

### 数据库迁移

项目使用JPA自动创建表结构，修改实体类后会自动更新数据库表结构。

### 日志配置

日志文件保存在 `logs/jiaowu-backend.log`，可在 `application.yml` 中修改日志配置。

## 许可证

MIT License 
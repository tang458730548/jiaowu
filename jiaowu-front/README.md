## 教务前端系统架构说明

### 1. 系统概览
- 基于 React 18 + Ant Design 5 + React Router v5 + Axios 的教务后台管理前端。
- 采用 Hash 路由；登录页与主布局分离，主布局内部承载二级业务路由。
- 菜单与首页配置由后端接口下发并本地持久化，鉴权通过 Bearer Token 注入请求头。
- 列表类页面以通用表格组件驱动，实现“搜索/列表/导出/弹窗增改”的标准化交互。

### 2. 技术栈与依赖
- UI：Ant Design 5（`ConfigProvider`、表单/表格/布局/弹窗等）
- 框架：React 18、React Router DOM v5（`HashRouter`/`Switch`/`Route`）
- 网络：Axios 1.x（实例、请求/响应拦截器、通用 `get/post/put/del` 封装）
- 样式：Sass（全局与页面级样式）
- 可视化：ECharts 5
- 本地化：moment zh-cn
- 构建：Create React App（`react-scripts`）

关键依赖片段：
- 见 `package.json`：antd、axios、echarts、moment、react-router-dom、sass 等

### 3. 目录结构（核心）
- `src/index.js`：入口，挂载 React 根节点；包裹 `HashRouter` 与 AntD `ConfigProvider(zhCN)`，加载全局样式。
- `src/App.js`：应用根组件，仅渲染路由容器。
- `src/router/index.js`：路由配置
  - 一级：`/` 登录页；`*` 主布局。
  - 二级（布局内容区）：`/home`、`/platform/employee`、`/platform/module`、`/platform/param`、其余走 404。
- `src/components/layout/Layout.js`：主布局（侧边菜单、顶部用户区、页签区、内容区、页脚）。
- `src/components/platform/*`：登录页、404、修改密码对话框等平台组件。
- `src/components/table/CommonTable.js`：通用表格组件（搜索区/操作区/表格/分页/弹窗），对外以配置驱动。
- `src/views/*`：
  - `Home.js`：仪表盘图表与统计卡片。
  - `platform/Employee.js`：职工管理。
  - `platform/Module.js`：模块（菜单）管理，树 + 表单。
  - `platform/Param.js`：系统参数管理。
- `src/api/index.js`：Axios 实例与拦截器；导出通用 `get/post/put/del`。
- `src/api/platform/*`：平台子域 API（登录/模块/职工/参数）。
- `src/assets/styles/*`：全局与页面样式。
- `src/utils/iconUtils.js`：图标映射与菜单/模块图标渲染。

### 4. 启动与应用装配
- 入口：`src/index.js` 设置 moment zh-cn，挂载 `HashRouter` 与 `ConfigProvider(zhCN)`。
- 根组件：`src/App.js` 渲染路由容器。
- 路由：
  - 一级路由：`/` → 登录；`*` → 主布局（内部再分发内容路由）。
  - 内容路由：`/home`、`/platform/employee`、`/platform/module`、`/platform/param`、`*`→404。

### 5. 布局与导航
- 侧边菜单：启动后调用 `moduleAPI.getModuleTree()`，前端过滤出可见、启用、具备 path 的模块，生成多级菜单；图标按模块类型与 `icon` 字段映射。
- 页签区：随路由动态维护；首页固定不可关闭；支持关闭当前/左/右/全部。
- 顶部用户区：展示用户昵称/邮箱；提供“系统设置”（跳转 `/platform/param`）、“修改密码”（弹窗）、“退出登录”。
- 页脚：展示从首页配置接口得到的版权信息（登录页也显示）。

### 6. 鉴权与请求
- Axios 实例：
  - `baseURL: http://localhost:9901`、超时 10s、默认 `Content-Type: application/json`。
  - 请求拦截：从 `localStorage.user` 读取 `accessToken` 注入 `Authorization: Bearer <token>`。
  - 响应拦截：
    - `responseType==='blob'`：返回完整响应（用于导出文件）。
    - 常规：返回 `response.data`。
    - 403：弹出鉴权失败提示，清理本地用户并跳回登录。
- 身份认证：
  - 登录页获取验证码与首页配置信息；成功登录后写入 `localStorage.user` 并跳转 `/home`。
  - 退出登录：清理本地并回到 `/`；403 统一回退。

### 7. API 模块
- `src/api/index.js`：导出 `get/post/put/del`，统一实例与拦截器。
- `authAPI`（`platform/login.js`）：验证码、员工/用户登录、登出、用户信息、修改密码、首页配置、刷新 Token。
- `moduleAPI`（`platform/module.js`）：模块树查询、创建、更新、删除、移动、批量删除。
- `employeeAPI`（`platform/employee.js`）：职工列表查询、创建、更新、删除、状态更新、导入/导出、批量删除、详情。
- `paramAPI`（`platform/param.js`）：系统参数查询、创建、更新、删除、状态更新、导出、详情。

约定：导出接口使用 `responseType: 'blob'`，文件名从 `content-disposition` 提取；分页与排序字段由页面层转换并传参至 API。

### 8. 通用表格组件（CommonTable）
- 目标：以配置驱动方式，快速搭建“搜索 + 操作（新增/导出/刷新）+ 列表 + 分页 + 弹窗表单”的页面。
- 能力：
  - 搜索区：支持 `input/select/number/date/radio/switch`；>3 个字段自动收起/展开。
  - 操作区：新增/导出/刷新。
  - 表格：统一 `rowKey`、受控排序回调、滚动区域高度可配。
  - 分页：组件内自绘，上一页/下一页、每页条数与统计。
  - 弹窗：分区表单、增改复用；对外暴露 `ref.showEditModal(record)`。

### 9. 业务页面
- 首页（`views/Home.js`）：ECharts 折线图与饼图示例，配合统计卡片展示。
- 职工管理（`views/platform/Employee.js`）：
  - 列表查询、搜索、排序、分页、状态切换、删除、编辑、新增、导出。
  - 与 `employeeAPI` 对接，导出支持 Blob 下载与文件名解析。
- 模块管理（`views/platform/Module.js`）：
  - 左侧树 + 右侧表单；支持新增/编辑/删除/刷新、层级自动计算、图标选择、可见/启用状态切换。
  - 数据源自 `moduleAPI.getModuleTree()` 并前端加工（title/key/children 等）。
- 系统参数（`views/platform/Param.js`）：
  - 支持分组/类型/状态筛选，是否可编辑控制可操作性，CSV 导出。

### 10. 样式与本地化
- 全局样式：`assets/styles/index.scss`；页面与组件样式分目录维护。
- 本地化：`ConfigProvider(zhCN)` + `moment.locale('zh-cn')`。

### 11. 构建与运行
- 开发：`npm start`
- 构建：`npm run build`
- 测试：`npm test`
- 基于 CRA（`react-scripts`），可通过 `craco.config.js` 做个性化配置。

### 12. 配置与环境
- 默认 `baseURL` 固定为 `http://localhost:9901`。
- 建议：引入环境变量（如 `.env.development`/`.env.production`）以区分环境 `REACT_APP_API_BASE`，并在 `src/api/index.js` 中读取。

### 13. 错误处理与安全
- 拦截器将后端错误标准化为 `Error(message)`，页面层统一 `message.error` 展示。
- 403 统一处理，回到登录；Token 存储在 `localStorage`（注意 XSS 风险与 Token 失效处理）。
- 导出使用 Blob URL，下载后及时 `revokeObjectURL`，避免内存泄漏。

### 14. 扩展建议
- 动态路由装配：将后端模块 `component` 字段与前端 `lazy import` 映射，构建“菜单下发 + 组件按需加载”。
- 路由守卫：在主布局或路由入口统一校验 `authAPI.isLoggedIn()`，未登录跳转登录。
- 分页/排序协议适配：将列表页的分页、排序字段映射下沉到 API 层，页面零散转换聚合。
- 统一错误码/埋点：在拦截器增加错误码分类上报与链路日志。 
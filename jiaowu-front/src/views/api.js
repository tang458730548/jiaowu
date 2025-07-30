// 向后兼容的API导出
// 新的API服务已迁移到 src/api/ 目录下
// 建议使用新的API服务：import { authAPI } from '../api/auth'; import { employeeAPI } from '../api/employee';

import { get, post, put, del } from '../api/index';

// 导出通用方法以保持向后兼容
export { get, post, put, del };

// 导出默认的api实例
export { default as api } from '../api/index'; 
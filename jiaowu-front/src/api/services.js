// 统一导出所有API服务
export { authAPI } from './platform/login';
export { employeeAPI } from './platform/employee';
export { moduleAPI } from './platform/module';

// 导出通用方法
export { get, post, put, del } from './index';
export { default as api } from './index'; 
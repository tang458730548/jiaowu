// 统一导出所有API服务
export { authAPI } from './auth';
export { employeeAPI } from './employee';
export { moduleAPI } from './module';

// 导出通用方法
export { get, post, put, del } from './index';
export { default as api } from './index'; 
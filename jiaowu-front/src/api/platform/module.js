import { get, post, put, del } from '../index';

// 模块管理相关API
export const moduleAPI = {
  // 获取模块树
  getModuleTree: () => {
    return get('/api/modules/tree');
  },

  // 创建模块
  createModule: (data) => {
    return post('/api/modules/create', data);
  },

  // 更新模块
  updateModule: (id, data) => {
    return put(`/api/modules/update/${id}`, data);
  },

  // 删除模块
  deleteModule: (id) => {
    return del(`/api/modules/delete/${id}`);
  },

  // 获取模块详情
  getModuleDetail: (id) => {
    return get(`/api/modules/${id}`);
  },

  // 移动模块
  moveModule: (id, targetParentId) => {
    return post(`/api/modules/move/${id}`, { targetParentId });
  },

  // 批量操作
  batchDeleteModules: (ids) => {
    return post('/api/modules/batchDelete', { ids });
  },
}; 
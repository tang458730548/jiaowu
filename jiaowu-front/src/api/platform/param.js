import { post, get } from '../index';
import api from '../index';

// 参数管理相关API
export const paramAPI = {
  // 查询参数列表
  queryParams: (params) => {
    return post('/api/params/query', params);
  },

  // 创建参数
  createParam: (data) => {
    return post('/api/params/create', data);
  },

  // 更新参数
  updateParam: (id, data) => {
    return post(`/api/params/update/${id}`, data);
  },

  // 删除参数
  deleteParam: (id) => {
    return post(`/api/params/delete/${id}`);
  },

  // 更新状态
  updateParamStatus: (id, status) => {
    return post(`/api/params/updateStatus/${id}`, { status });
  },

  // 导出参数
  exportParams: (params) => {
    return api.post('/api/params/export', params, {
      responseType: 'blob',
    });
  },

  // 获取详情
  getParamDetail: (id) => {
    return get(`/api/params/get/${id}`);
  },
}; 
import { post, get, put, del } from '../index';
import api from '../index';

// 用户管理相关API
export const userAPI = {
  // 查询用户列表
  getUserList: (params) => {
    return get('/api/users/query', params);
  },

  // 创建用户
  createUser: (data) => {
    return post('/api/users/create', data);
  },

  // 更新用户信息
  updateUser: (id, data) => {
    return post(`/api/users/update/${id}`, data);
  },

  // 删除用户
  deleteUser: (id) => {
    return post(`/api/users/delete/${id}`);
  },

  // 更新用户状态
  updateUserStatus: (id, status) => {
    return post(`/api/users/updateStatus/${id}`, { status });
  },

  // 导出用户数据
  exportUsers: (params) => {
    return api.post('/api/users/export', params, {
      responseType: 'blob',
    });
  },

  // 获取用户详情
  getUserById: (id) => {
    return get(`/api/users/${id}`);
  },

  // 批量操作
  batchDeleteUsers: (ids) => {
    return post('/api/users/batchDelete', { ids });
  },

  // 重置密码
  resetPassword: (id) => {
    return post(`/api/users/resetPassword/${id}`);
  },

  // 修改密码
  changePassword: (id, data) => {
    return post(`/api/users/changePassword/${id}`, data);
  },

  // 导入用户数据
  importUsers: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return post('/api/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}; 
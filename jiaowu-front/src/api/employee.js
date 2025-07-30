import { post, get, put, del } from './index';
import api from './index';

// 员工管理相关API
export const employeeAPI = {
  // 查询员工列表
  getEmployeeList: (params) => {
    return post('/api/employees/query', params);
  },

  // 创建员工
  createEmployee: (data) => {
    return post('/api/employees/create', data);
  },

  // 更新员工信息
  updateEmployee: (id, data) => {
    return post(`/api/employees/update/${id}`, data);
  },

  // 删除员工
  deleteEmployee: (id) => {
    return post(`/api/employees/delete/${id}`);
  },

  // 更新员工状态
  updateEmployeeStatus: (id, status) => {
    return post(`/api/employees/updateStatus/${id}`, { status });
  },

  // 导出员工数据
  exportEmployees: (params) => {
    return api.post('/api/employees/export', params, {
      responseType: 'blob',
    });
  },

  // 获取员工详情
  getEmployeeDetail: (id) => {
    return get(`/api/employees/${id}`);
  },

  // 批量操作
  batchDeleteEmployees: (ids) => {
    return post('/api/employees/batchDelete', { ids });
  },

  // 导入员工数据
  importEmployees: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return post('/api/employees/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
}; 
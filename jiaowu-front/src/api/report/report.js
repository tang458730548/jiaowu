import { post, get, put, del } from '../index';
import api from '../index';

// 报告管理相关API
export const reportAPI = {
  // 查询报告列表
  getReportList: (params) => {
    return get('/api/reports/query', params);
  },

  // 创建报告
  createReport: (data) => {
    return post('/api/reports/create', data);
  },

  // 更新报告信息
  updateReport: (id, data) => {
    return post(`/api/reports/update/${id}`, data);
  },

  // 删除报告
  deleteReport: (id) => {
    return post(`/api/reports/delete/${id}`);
  },

  // 更新报告状态
  updateReportStatus: (id, status) => {
    return post(`/api/reports/updateStatus/${id}`, { status });
  },

  // 导出报告数据
  exportReports: (params) => {
    return api.post('/api/reports/export', params, {
      responseType: 'blob',
    });
  },

  // 获取报告详情
  getReportById: (id) => {
    return get(`/api/reports/${id}`);
  },

  // 批量操作
  batchDeleteReports: (ids) => {
    return post('/api/reports/batchDelete', { ids });
  },

  // 生成报告
  generateReport: (id) => {
    return post(`/api/reports/generate/${id}`);
  },

  // 发布报告
  publishReport: (id) => {
    return post(`/api/reports/publish/${id}`);
  },

  // 归档报告
  archiveReport: (id) => {
    return post(`/api/reports/archive/${id}`);
  },

  // 导入报告数据
  importReports: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return post('/api/reports/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 预览报告
  previewReport: (id) => {
    return get(`/api/report-export/${id}/preview`);
  },
}; 
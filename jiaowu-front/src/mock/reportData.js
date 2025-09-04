// 模拟报告列表数据
export const mockReportData = {
  "code": 200,
  "message": "操作成功",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "员工统计报告",
        "description": "员工数据统计分析报告",
        "reportType": "EMPLOYEE_REPORT",
        "status": "DRAFT",
        "creatorId": 1,
        "createTime": "2025-08-03T16:28:29",
        "updateTime": "2025-08-03T16:28:29"
      },
      {
        "id": 2,
        "name": "模块统计报告",
        "description": "模块数据统计分析报告",
        "reportType": "MODULE_REPORT",
        "status": "DRAFT",
        "creatorId": 1,
        "createTime": "2025-08-03T16:28:45",
        "updateTime": "2025-08-03T16:28:45"
      }
    ],
    "pageable": {
      "sort": {
        "empty": true,
        "sorted": false,
        "unsorted": true
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 1,
    "last": true,
    "totalElements": 2,
    "number": 0,
    "size": 10,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "numberOfElements": 2,
    "first": true,
    "empty": false
  }
};

// 模拟API响应
export const mockReportAPI = {
  getReportList: (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockReportData.data);
      }, 500);
    });
  }
};

// 报告类型选项
export const reportTypeOptions = [
  { value: 'MODULE_REPORT', label: '模块统计报告' },
  { value: 'USER_REPORT', label: '用户统计报告' },
  { value: 'SYSTEM_REPORT', label: '系统统计报告' },
  { value: 'PERFORMANCE_REPORT', label: '性能统计报告' }
];

// 状态选项
export const statusOptions = [
  { value: 'DRAFT', label: '草稿' },
  { value: 'PUBLISHED', label: '已发布' },
  { value: 'ARCHIVED', label: '已归档' },
  { value: 'DELETED', label: '已删除' }
]; 
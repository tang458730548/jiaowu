import React, { useState, useEffect } from 'react';
import { Button, message, Tag, Tooltip, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { reportAPI } from '../../api/report/report';
import CommonTable from '../../components/table/CommonTable';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState({});

  // 报告类型映射
  const reportTypeMap = {
    'MODULE_REPORT': '模块统计报告',
    'USER_REPORT': '用户统计报告',
    'SYSTEM_REPORT': '系统统计报告',
    'PERFORMANCE_REPORT': '性能统计报告',
    'EMPLOYEE_REPORT': '员工统计报告'
  };

  // 状态映射
  const statusMap = {
    'DRAFT': { text: '草稿', color: 'orange' },
    'PUBLISHED': { text: '已发布', color: 'green' },
    'ARCHIVED': { text: '已归档', color: 'gray' },
    'DELETED': { text: '已删除', color: 'red' }
  };

  // 获取列表
  const fetchReports = async (page = 0, pageSize = 10, sortField = null, sortOrder = null) => {
    setLoading(true);
    try {
      const requestBody = { 
        page, 
        size: pageSize, 
        ...searchParams 
      };
      if (sortField && sortOrder) {
        requestBody.sort = sortField;
        requestBody.order = sortOrder === 'ascend' ? 'asc' : 'desc';
      }
      const response = await reportAPI.getReportList(requestBody);
      // 处理API响应格式：{ code: 200, message: "操作成功", data: { content: [], ... } }
      const data = response.data || response;
      console.log('API响应数据:', response);
      console.log('处理后的数据:', data);
      console.log('报告列表:', data.content);
      setReports(data.content || []);
      setPagination({
        current: (data.number || 0) + 1,
        pageSize: data.size || pageSize,
        total: data.totalElements || 0,
      });
    } catch (e) {
      message.error('获取报告列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(0, 10, null, null);
  }, []);

  // 删除
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await reportAPI.deleteReport(id);
      message.success('删除成功');
      fetchReports(pagination.current - 1, pagination.pageSize, null, null);
    } catch {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 修改状态
  const handleStatusChange = async (id, status) => {
    try {
      await reportAPI.updateReportStatus(id, status);
      message.success('状态修改成功');
      fetchReports(pagination.current - 1, pagination.pageSize, null, null);
    } catch {
      message.error('状态修改失败');
    }
  };

  // 新增
  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await reportAPI.createReport(values);
      message.success('添加成功');
      fetchReports(pagination.current - 1, pagination.pageSize, null, null);
    } catch (error) {
      message.error(error.message || '添加失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 编辑
  const handleEdit = async (id, values) => {
    setLoading(true);
    try {
      await reportAPI.updateReport(id, values);
      message.success('修改成功');
      fetchReports(pagination.current - 1, pagination.pageSize, null, null);
    } catch (error) {
      message.error(error.message || '修改失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 分页和排序
  const handleTableChange = (pag, filters, sorter) => {
    const sortField = sorter.field;
    const sortOrder = sorter.order;
    fetchReports(pag.current - 1, pag.pageSize, sortField, sortOrder);
  };

  // 搜索
  const handleSearch = (values) => {
    const newSearchParams = values;
    setSearchParams(newSearchParams);
    setPagination({ ...pagination, current: 1 });
    
    const requestBody = { 
      page: 0, 
      size: pagination.pageSize, 
      ...newSearchParams 
    };
    
    setLoading(true);
    reportAPI.getReportList(requestBody)
      .then(response => {
        // 处理API响应格式：{ code: 200, message: "操作成功", data: { content: [], ... } }
        const data = response.data || response;
        setReports(data.content || []);
        setPagination({
          current: 1,
          pageSize: data.size || pagination.pageSize,
          total: data.totalElements || 0,
        });
      })
      .catch(e => {
        message.error('获取报告列表失败');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({});
    setPagination({ ...pagination, current: 1 });
    
    const requestBody = { 
      page: 0, 
      size: pagination.pageSize
    };
    
    setLoading(true);
    reportAPI.getReportList(requestBody)
      .then(response => {
        // 处理API响应格式：{ code: 200, message: "操作成功", data: { content: [], ... } }
        const data = response.data || response;
        setReports(data.content || []);
        setPagination({
          current: 1,
          pageSize: data.size || pagination.pageSize,
          total: data.totalElements || 0,
        });
      })
      .catch(e => {
        message.error('获取报告列表失败');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 导出数据
  const handleExport = async () => {
    try {
      const requestBody = { 
        page: 0, 
        size: 999999,
        ...searchParams 
      };
      
      const response = await reportAPI.exportReports(requestBody);
      
      const contentDisposition = response.headers?.['content-disposition'];
      let filename = '报告列表.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('导出成功');
    } catch (error) {
      message.error(error.message || '导出失败');
    }
  };

  // 刷新
  const handleRefresh = () => {
    fetchReports(pagination.current - 1, pagination.pageSize, null, null);
  };

  // 查看报告
  const handleView = (record) => {
    // 跳转到报告预览页面
    window.open(`/sys/report-preview/${record.id}`, '_blank');
  };

  const columns = [
    { 
      title: '报告名称', 
      dataIndex: 'name', 
      key: 'name',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Tooltip title={record.description}>
          <span style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => handleView(record)}>
            {text}
          </span>
        </Tooltip>
      )
    },
    { 
      title: '报告类型', 
      dataIndex: 'reportType', 
      key: 'reportType',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (type) => reportTypeMap[type] || type
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (status) => {
        const statusInfo = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    { 
      title: '创建时间', 
      dataIndex: 'createTime', 
      key: 'createTime',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (time) => time ? new Date(time).toLocaleString() : '-'
    },
    { 
      title: '更新时间', 
      dataIndex: 'updateTime', 
      key: 'updateTime',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (time) => time ? new Date(time).toLocaleString() : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id, record)}
          >
            编辑
          </Button>
          <Popconfirm 
            title="确定要删除吗？" 
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 搜索配置
  const searchConfig = {
    fields: [
      {
        name: 'name',
        label: '报告名称',
        type: 'input',
        placeholder: '请输入报告名称',
        width: 200
      },
      {
        name: 'reportType',
        label: '报告类型',
        type: 'select',
        placeholder: '请选择报告类型',
        width: 150,
        options: Object.entries(reportTypeMap).map(([key, value]) => ({
          value: key,
          label: value
        }))
      },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        placeholder: '请选择状态',
        width: 120,
        options: Object.entries(statusMap).map(([key, value]) => ({
          value: key,
          label: value.text
        }))
      }
    ]
  };

  // 弹窗配置
  const modalConfig = {
    addTitle: '新增报告',
    editTitle: '编辑报告',
    width: 650,
    defaultValues: {
      status: 'DRAFT',
      reportType: 'MODULE_REPORT'
    },
    fields: [
      {
        title: '基本信息',
        items: [
          {
            name: 'name',
            label: <span>报告名称 <span style={{color:'red'}}>*</span></span>,
            type: 'input',
            placeholder: '请输入报告名称',
            rules: [{ required: true, message: '请输入报告名称' }]
          },
          {
            name: 'reportType',
            label: <span>报告类型 <span style={{color:'red'}}>*</span></span>,
            type: 'select',
            placeholder: '请选择报告类型',
            options: Object.entries(reportTypeMap).map(([key, value]) => ({
              value: key,
              label: value
            })),
            rules: [{ required: true, message: '请选择报告类型' }]
          },
          {
            name: 'status',
            label: <span>状态 <span style={{color:'red'}}>*</span></span>,
            type: 'radio',
            options: Object.entries(statusMap).map(([key, value]) => ({
              value: key,
              label: value.text
            })),
            rules: [{ required: true, message: '请选择状态' }]
          },
          {
            name: 'description',
            label: '报告描述',
            type: 'textarea',
            placeholder: '请输入报告描述',
            rows: 4
          }
        ]
      }
    ]
  };

  return (
    <>
      <CommonTable
        title="报告管理"
        columns={columns}
        dataSource={reports}
        loading={loading}
        pagination={pagination}
        onTableChange={handleTableChange}
        onSearch={handleSearch}
        onReset={handleReset}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onRefresh={handleRefresh}
        searchConfig={searchConfig}
        modalConfig={modalConfig}
        addButtonText="新增报告"
        exportButtonText="导出数据"
        rowKey="id"
      />
    </>
  );
};

export default ReportList; 
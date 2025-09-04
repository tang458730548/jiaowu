import React, { useState, useEffect } from 'react';
import { Button, message, Switch, Popconfirm } from 'antd';
import { employeeAPI } from '../../api/platform/employee';
import CommonTable from '../../components/table/CommonTable';
import CryptoJS from 'crypto-js';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState({});

  // 获取列表
  const fetchEmployees = async (page = 0, pageSize = 10, sortField = null, sortOrder = null) => {
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
      const response = await employeeAPI.getEmployeeList(requestBody);
      // 处理API响应格式：{ code: 200, message: "操作成功", data: { content: [], ... } }
      const data = response.data || response;
      setEmployees(data.content || []);
      setPagination({
        current: (data.number || 0) + 1,
        pageSize: data.size || pageSize,
        total: data.totalElements || 0,
      });
    } catch (e) {
      message.error('获取职工列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(0, 10, null, null);
  }, []);

  // 删除
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await employeeAPI.deleteEmployee(id);
      message.success('删除成功');
      fetchEmployees(pagination.current - 1, pagination.pageSize, null, null);
    } catch {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 修改状态
  const handleStatusChange = async (id, checked) => {
    try {
      await employeeAPI.updateEmployeeStatus(id, checked ? 1 : 0);
      message.success('状态修改成功');
      fetchEmployees(pagination.current - 1, pagination.pageSize, null, null);
    } catch {
      message.error('状态修改失败');
    }
  };

  // 新增
  const handleAdd = async (values) => {
    setLoading(true);
    try {
      // 对密码进行MD5加密
      if (values.password) {
        values.password = CryptoJS.MD5(values.password).toString();
      }
      await employeeAPI.createEmployee(values);
      message.success('添加成功');
      fetchEmployees(pagination.current - 1, pagination.pageSize, null, null);
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
      await employeeAPI.updateEmployee(id, values);
      message.success('修改成功');
      fetchEmployees(pagination.current - 1, pagination.pageSize, null, null);
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
    fetchEmployees(pag.current - 1, pag.pageSize, sortField, sortOrder);
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
    employeeAPI.getEmployeeList(requestBody)
      .then(response => {
        // 处理API响应格式：{ code: 200, message: "操作成功", data: { content: [], ... } }
        const data = response.data || response;
        setEmployees(data.content || []);
        setPagination({
          current: 1,
          pageSize: data.size || pagination.pageSize,
          total: data.totalElements || 0,
        });
      })
      .catch(e => {
        message.error('获取职工列表失败');
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
    employeeAPI.getEmployeeList(requestBody)
      .then(response => {
        // 处理API响应格式：{ code: 200, message: "操作成功", data: { content: [], ... } }
        const data = response.data || response;
        setEmployees(data.content || []);
        setPagination({
          current: 1,
          pageSize: data.size || pagination.pageSize,
          total: data.totalElements || 0,
        });
      })
      .catch(e => {
        message.error('获取职工列表失败');
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
      
      const response = await employeeAPI.exportEmployees(requestBody);
      
      const contentDisposition = response.headers?.['content-disposition'];
      let filename = '职工列表.xlsx';
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
    fetchEmployees(pagination.current - 1, pagination.pageSize, null, null);
  };

  const columns = [
    { 
      title: '用户名', 
      dataIndex: 'username', 
      key: 'username',
      sorter: true,
      sortDirections: ['ascend', 'descend']
    },
    { 
      title: '性别', 
      dataIndex: 'gender', 
      key: 'gender', 
      render: v => v === 'F' ? '女' : v === 'M' ? '男' : '-',
      sorter: true,
      sortDirections: ['ascend', 'descend']
    },
    { 
      title: '昵称', 
      dataIndex: 'nickname', 
      key: 'nickname',
      sorter: true,
      sortDirections: ['ascend', 'descend']
    },
    { 
      title: '职称', 
      dataIndex: 'title', 
      key: 'title',
      sorter: true,
      sortDirections: ['ascend', 'descend']
    },
    { 
      title: '邮箱', 
      dataIndex: 'email', 
      key: 'email',
      sorter: true,
      sortDirections: ['ascend', 'descend']
    },
    { 
      title: '入学年份', 
      dataIndex: 'enrollYear', 
      key: 'enrollYear',
      sorter: true,
      sortDirections: ['ascend', 'descend']
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="正常"
          unCheckedChildren="禁用"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.id, record)}>编辑</Button>
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 搜索配置
  const searchConfig = {
    fields: [
      {
        name: 'username',
        label: '用户名',
        type: 'input',
        placeholder: '请输入用户名',
        width: 200
      },
      {
        name: 'nickname',
        label: '昵称',
        type: 'input',
        placeholder: '请输入昵称',
        width: 200
      }
    ]
  };

  // 弹窗配置
  const modalConfig = {
    addTitle: '新增职工',
    editTitle: '编辑职工',
    width: 650,
    defaultValues: {
      status: 1
    },
    fields: [
      {
        title: '账号信息',
        items: [
          {
            name: 'username',
            label: <span>用户名 <span style={{color:'red'}}>*</span></span>,
            type: 'input',
            placeholder: '请输入用户名',
            rules: [{ required: true, message: '请输入用户名' }]
          },
          {
            name: 'password',
            label: <span>密码 <span style={{color:'red'}}>*</span></span>,
            type: 'password',
            placeholder: '请输入密码',
            rules: [{ required: true, message: '请输入密码' }],
            showInEdit: false // 编辑时不显示密码字段
          }
        ]
      },
      {
        title: '基础信息',
        items: [
          {
            name: 'gender',
            label: <span>性别 <span style={{color:'red'}}>*</span></span>,
            type: 'radio',
            options: [
              { value: 'M', label: '男' },
              { value: 'F', label: '女' }
            ],
            rules: [{ required: true, message: '请选择性别' }]
          },
          {
            name: 'nickname',
            label: <span>昵称 <span style={{color:'red'}}>*</span></span>,
            type: 'input',
            placeholder: '请输入昵称',
            rules: [{ required: true, message: '请输入昵称' }]
          },
          {
            name: 'title',
            label: '职称',
            type: 'input',
            placeholder: '请输入职称'
          },
          {
            name: 'email',
            label: <span>邮箱 <span style={{color:'red'}}>*</span></span>,
            type: 'input',
            placeholder: '请输入邮箱',
            rules: [
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]
          },
          {
            name: 'enrollYear',
            label: '入学年份',
            type: 'number',
            placeholder: '如：2020',
            min: 1900,
            max: new Date().getFullYear() + 10
          },
          {
            name: 'status',
            label: <span>状态 <span style={{color:'red'}}>*</span></span>,
            type: 'radio',
            options: [
              { value: 1, label: '正常' },
              { value: 0, label: '禁用' }
            ],
            rules: [{ required: true, message: '请选择状态' }]
          }
        ]
      }
    ]
  };

  return (
    <CommonTable
      title="职工管理"
      columns={columns}
      dataSource={employees}
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
      addButtonText="新增职工"
      exportButtonText="导出数据"
      rowKey="id"
    />
  );
};

export default EmployeeList; 
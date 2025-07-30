import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message, Select, Radio, Divider, InputNumber, Switch, Tooltip } from 'antd';
import { ReloadOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import { employeeAPI } from '../api/employee';
import CryptoJS from 'crypto-js';

// API基础路径已迁移到employeeAPI中

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchForm] = Form.useForm();
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
      const data = await employeeAPI.getEmployeeList(requestBody);
      setEmployees(data.content || []);
      setPagination({
        current: (data.number || 0) + 1, // 后端number从0开始，Antd从1开始
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

  // 新增/编辑弹窗
  const showAddModal = () => {
    setEditingEmployee(null);
    form.resetFields();
    setModalVisible(true);
  };
  const showEditModal = (record) => {
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

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

  // 新增/编辑提交
  const handleOk = () => {
    form.validateFields().then(async values => {
      setLoading(true);
      try {
        // 如果是新增用户，对密码进行MD5加密
        if (!editingEmployee && values.password) {
          values.password = CryptoJS.MD5(values.password).toString();
        }
        
        if (editingEmployee) {
          await employeeAPI.updateEmployee(editingEmployee.id, values);
          message.success('修改成功');
        } else {
          await employeeAPI.createEmployee(values);
          message.success('添加成功');
        }
        setModalVisible(false);
        fetchEmployees(pagination.current - 1, pagination.pageSize, null, null);
      } catch (error) {
        message.error(error.message || (editingEmployee ? '修改失败' : '添加失败'));
      } finally {
        setLoading(false);
      }
    });
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
    
    // 直接使用新的搜索参数，不依赖状态
    const requestBody = { 
      page: 0, 
      size: pagination.pageSize, 
      ...newSearchParams 
    };
    
    setLoading(true);
    employeeAPI.getEmployeeList(requestBody)
      .then(data => {
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
    searchForm.resetFields();
    setSearchParams({});
    setPagination({ ...pagination, current: 1 });
    
    // 直接使用空的搜索参数
    const requestBody = { 
      page: 0, 
      size: pagination.pageSize
    };
    
    setLoading(true);
    employeeAPI.getEmployeeList(requestBody)
      .then(data => {
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
        size: 999999, // 导出所有数据
        ...searchParams 
      };
      
      const response = await employeeAPI.exportEmployees(requestBody);
      
      // 获取文件名
      const contentDisposition = response.headers?.['content-disposition'];
      let filename = '职工列表.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // 下载文件
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
          <Button type="link" onClick={() => showEditModal(record)}>编辑</Button>
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      
      {/* 搜索表单 */}
      <div style={{ marginBottom: 16, padding: '16px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
        <Form 
          form={searchForm} 
          layout="inline" 
          onFinish={handleSearch}
          style={{ marginBottom: 0 }}
        >
          <Form.Item name="username" label="用户名">
            <Input placeholder="请输入用户名" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="请输入昵称" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginRight: 8 }}>
            新增职工
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出数据
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={employees}
        loading={loading}
        bordered
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          pageSizeOptions: ['10', '20', '50', '100'],
          size: 'default'
        }}
        onChange={handleTableChange}
      />
      <Modal
        title={editingEmployee ? '编辑职工' : '新增职工'}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
        confirmLoading={loading}
        width={650}
        footer={null}
        bodyStyle={{ maxHeight: '70vh', overflow: 'hidden' }}
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          <Form form={form} layout="horizontal" onFinish={handleOk} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Divider orientation="left" style={{ fontWeight: 'bold' }}>账号信息</Divider>
            <Form.Item name="username" label={<span>用户名 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请输入用户名' }]}> 
              <Input placeholder="请输入用户名" autoComplete="off" />
            </Form.Item>
            {!editingEmployee && (
              <Form.Item name="password" label={<span>密码 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请输入密码' }]}> 
                <Input.Password placeholder="请输入密码" autoComplete="new-password" />
              </Form.Item>
            )}
            <Divider orientation="left" style={{ fontWeight: 'bold' }}>基础信息</Divider>
            <Form.Item name="gender" label={<span>性别 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请选择性别' }]}> 
              <Radio.Group>
                <Radio value="M">男</Radio>
                <Radio value="F">女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="nickname" label={<span>昵称 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请输入昵称' }]}> 
              <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item name="title" label="职称"> 
              <Input placeholder="请输入职称" />
            </Form.Item>
            <Form.Item name="email" label={<span>邮箱 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}> 
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item name="enrollYear" label="入学年份"> 
              <InputNumber 
                placeholder="如：2020" 
                min={1900} 
                max={new Date().getFullYear() + 10}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="status" label={<span>状态 <span style={{color:'red'}}>*</span></span>} rules={[{ required: true, message: '请选择状态' }]}> 
              <Radio.Group>
                <Radio value={1}>正常</Radio>
                <Radio value={0}>禁用</Radio>
              </Radio.Group>
            </Form.Item>
            <Divider style={{margin:'16px 0 8px 0'}}/>
            <div style={{textAlign:'center'}}>
              <Button type="primary" htmlType="submit" loading={loading} style={{minWidth:120,marginRight:16}}>提交</Button>
              <Button onClick={()=>setModalVisible(false)} style={{minWidth:100}}>取消</Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeList; 
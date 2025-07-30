import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message, Select, Radio, Row, Col, Divider, InputNumber, Switch, Tooltip } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { get, post } from './api';

const apiBase = 'http://localhost:9901/api/employees';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // 获取列表
  const fetchEmployees = async (page = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const data = await get(`${apiBase}/query`, { page, size: pageSize });
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
    fetchEmployees();
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
      await fetch(`${apiBase}/delete/${id}`, { method: 'POST' });
      message.success('删除成功');
      fetchEmployees(pagination.current - 1, pagination.pageSize);
    } catch {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 修改状态
  const handleStatusChange = async (id, checked) => {
    try {
      await fetch(`${apiBase}/updateStatus/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: checked ? 1 : 0 }),
      });
      message.success('状态修改成功');
      fetchEmployees(pagination.current - 1, pagination.pageSize);
    } catch {
      message.error('状态修改失败');
    }
  };

  // 新增/编辑提交
  const handleOk = () => {
    form.validateFields().then(async values => {
      setLoading(true);
      try {
        if (editingEmployee) {
          const response = await fetch(`${apiBase}/update/${editingEmployee.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '修改失败');
          }
          message.success('修改成功');
        } else {
          await post(`${apiBase}/create`, values);
          message.success('添加成功');
        }
        setModalVisible(false);
        fetchEmployees(pagination.current - 1, pagination.pageSize);
      } catch (error) {
        message.error(error.message || (editingEmployee ? '修改失败' : '添加失败'));
      } finally {
        setLoading(false);
      }
    });
  };

  // 分页
  const handleTableChange = (pag) => {
    fetchEmployees(pag.current - 1, pag.pageSize);
  };

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '性别', dataIndex: 'gender', key: 'gender', render: v => v === 'F' ? '女' : v === 'M' ? '男' : '-' },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '职称', dataIndex: 'title', key: 'title' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '入学年份', dataIndex: 'enrollYear', key: 'enrollYear' },
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: 0, marginRight: 16 }}>职工管理</h3>
          <Tooltip title="刷新列表">
            <Button 
              type="default" 
              icon={<ReloadOutlined />} 
              onClick={() => fetchEmployees(pagination.current - 1, pagination.pageSize)}
              loading={loading}
              style={{ marginRight: 8 }}
            >
              刷新
            </Button>
          </Tooltip>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          新增职工
        </Button>
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
            <Form.Item name="nickname" label="昵称"> 
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
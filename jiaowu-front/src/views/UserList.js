import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message } from 'antd';

const initialUsers = [
  { id: 1, username: 'admin', name: '管理员', email: 'admin@example.com' },
  { id: 2, username: 'user1', name: '张三', email: 'zhangsan@example.com' },
];

const UserList = () => {
  const [users, setUsers] = useState(initialUsers);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const showAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    message.success('删除成功');
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, ...values } : u));
        message.success('修改成功');
      } else {
        setUsers([...users, { ...values, id: Date.now() }]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
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
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={showAddModal}>新增用户</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={users} bordered />
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList; 
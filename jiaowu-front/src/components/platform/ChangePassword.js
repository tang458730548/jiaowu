import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authAPI } from '../../api/platform/login';
import CryptoJS from 'crypto-js';

const ChangePassword = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 对密码进行MD5加密
      const encryptedOldPassword = CryptoJS.MD5(values.oldPassword).toString();
      const encryptedNewPassword = CryptoJS.MD5(values.newPassword).toString();
      
      await authAPI.changePassword({
        oldPassword: encryptedOldPassword,
        newPassword: encryptedNewPassword,
      });
      
      message.success('密码修改成功！');
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error(error.message || '密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="修改密码"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="oldPassword"
          label="当前密码"
          rules={[
            { required: true, message: '请输入当前密码' },
            { min: 6, message: '密码长度不能少于6位' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入当前密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度不能少于6位' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入新密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入新密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword; 
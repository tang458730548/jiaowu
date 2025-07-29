import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.scss';
import logo2 from '../assets/img/logo2.png';
import { useHistory } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (values.username === 'admin' && values.password === '123456') {
        message.success('登录成功！');
        history.push('/home');
      } else {
        message.error('账号或密码错误');
      }
    }, 1000);
  };

  return (
    <div className="login-bg">
      <div className="login-layout">
        <div className="login-left">
          {/* 可替换为SVG或更复杂的插画 */}
          <div className="login-slogan">欢迎使用教务管理系统</div>
          <div className="login-description">
            <p>• 学生信息管理</p>
            <p>• 课程安排管理</p>
            <p>• 成绩录入查询</p>
            <p>• 教师信息管理</p>
          </div>
          <div className="login-notice">
            <h4>系统公告</h4>
            <p>2024年春季学期选课将于3月1日开始</p>
            <p>请各位师生及时关注系统通知</p>
          </div>
          {/* <img
            className="login-illustration"
            src={logo3}
          /> */}
        </div>
        <div className="login-right">
          <Card className="login-card">
            <div className="login-logo">
              <img src={logo2} alt="教务系统Logo" />
            </div>
            <Title level={3} className="login-title">教务管理系统登录</Title>
            <Form name="login" onFinish={onFinish} layout="vertical">
              <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}> 
                <Input prefix={<UserOutlined />} placeholder="账号" size="large" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}> 
                <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login; 
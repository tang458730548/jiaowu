import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../../assets/styles/components/login.scss';
import logo2 from '../../assets/img/logo2.png';
import { useHistory } from 'react-router-dom';
import { authAPI } from '../../api/platform/login';
import CryptoJS from 'crypto-js';

const { Title } = Typography;
const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [indexPageInfos, setIndexPageInfos] = useState({});

  // 获取验证码
  const fetchCaptcha = async () => {
    try {
      const res = await authAPI.getCaptcha(sessionId);
      setCaptchaCode(res.data.code);
      setSessionId(res.data.sessionId);
    } catch {
      setCaptchaCode('');
      setSessionId('');
    }
  };

  //获取首页系统配置信息
  const getIndexPageInfos = async () => {
    try {
      const res = await authAPI.getIndexPageInfos();
      const data = res.data
      setIndexPageInfos({
        systemName: data.systemName,
        copyright: data.copyright,
        notice: data.notice
      })
      localStorage.setItem('indexPageInfos', JSON.stringify({
        systemName: data.systemName,
        copyright: data.copyright,
        notice: data.notice
      }));
    } catch (e) {
      setIndexPageInfos({})
    }
  };

  React.useEffect(() => {
    getIndexPageInfos();
    fetchCaptcha();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // const encryptedPassword = CryptoJS.MD5(values.password).toString();
      const res = await authAPI.employeeLogin({
        username: values.username,
        password: values.password,
        verificationCode: values.verificationCode, // 用户输入的验证码
        code: captchaCode, // 后端下发的code
        sessionId: sessionId, // sessionId
      });
      setLoading(false);
      if (res && res.code === 200) {
        // 存储token到localStorage
        localStorage.setItem('user', JSON.stringify(res.data));
        message.success('登录成功！');
        history.push('/home');
      } else {
        message.error(res.message || '账号、密码或验证码错误');
        fetchCaptcha();
      }
    } catch (e) {
      setLoading(false);
      message.error((e && e.message) || '登录失败');
      fetchCaptcha();
    }
  };

  return (
    <div className="login-bg">
      <div className="login-layout">
        <div className="login-left">
          {/* 可替换为SVG或更复杂的插画 */}
          <div className="login-slogan">欢迎使用</div>
          <div>
            {indexPageInfos.systemName}</div>
          <div className="login-description">
            <p>• 学生信息管理</p>
            <p>• 课程安排管理</p>
            <p>• 成绩录入查询</p>
            <p>• 教师信息管理</p>
          </div>
          <div className="login-notice">
            <h4>系统公告</h4>
            {/* <p>2024年春季学期选课将于3月1日开始</p>
            <p>请各位师生及时关注系统通知</p> */}
            <p style={{ maxWidth: 200 }}>
              {indexPageInfos.notice}
            </p>
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
            <Title level={4} className="login-title">
              {indexPageInfos.systemName}
            </Title>
            <Form name="login" onFinish={onFinish} layout="vertical">
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="账号"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="verificationCode"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Input
                    placeholder="验证码"
                    size="large"
                    style={{ flex: 1, marginRight: 8 }}
                    autoComplete="off"
                  />
                  <div
                    style={{
                      height: 40,
                      width: 100,
                      cursor: 'pointer',
                      borderRadius: 4,
                      border: '1px solid #eee',
                      backgroundColor: '#f6f8fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#333',
                      userSelect: 'none',
                    }}
                    onClick={fetchCaptcha}
                    title="点击刷新验证码"
                  >
                    {captchaCode}
                  </div>
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
      {/* 底部版权信息 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 24px',
          height: 50,
          lineHeight: '26px',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '12px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
          }}
        >
          {indexPageInfos.copyright}
        </div>
      </div>
    </div>
  );
};

export default Login;

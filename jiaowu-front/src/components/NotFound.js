import React from 'react';
import { Result, Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { HomeOutlined, RollbackOutlined } from '@ant-design/icons';

const NotFound = ({ path }) => {
  const history = useHistory();
  const location = useLocation();
  
  // 使用传入的path参数，如果没有则使用当前location的pathname
  const currentPath = path || location.pathname;

  const handleGoHome = () => {
    history.push('/home');
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f6f8fa'
    }}>
      <Result
        status="404"
        title="404"
        subTitle={`抱歉，您访问的页面 "${currentPath}" 不存在。`}
        extra={[
          <Button 
            type="primary" 
            icon={<HomeOutlined />} 
            onClick={handleGoHome}
            key="home"
            style={{ marginRight: 8 }}
          >
            返回首页
          </Button>,
          <Button 
            icon={<RollbackOutlined />} 
            onClick={handleGoBack}
            key="back"
          >
            返回上页
          </Button>
        ]}
        style={{
          background: '#fff',
          padding: '48px 32px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: 500,
          width: '100%'
        }}
      />
      <div style={{ 
        textAlign: 'center', 
        marginTop: 16, 
        color: '#666',
        fontSize: '12px'
      }}>
        <p>可用的页面路径：</p>
        <p style={{ margin: '4px 0' }}>• / - 登录页面</p>
        <p style={{ margin: '4px 0' }}>• /home - 首页</p>
        <p style={{ margin: '4px 0' }}>• /sys/module - 模块管理</p>
      </div>
    </div>
  );
};

export default NotFound; 
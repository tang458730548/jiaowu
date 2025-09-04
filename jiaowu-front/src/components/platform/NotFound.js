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
      width: '100%',
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
          width: '100%'
        }}
      />
    </div>
  );
};

export default NotFound; 
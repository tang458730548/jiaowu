import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Layout, Menu, Dropdown, Tabs, Card, Row, Col, Avatar, Badge, Divider } from 'antd';
import { 
  UserOutlined, 
  AppstoreOutlined, 
  InfoCircleOutlined, 
  TeamOutlined, 
  CloseOutlined,
  SettingOutlined,
  LogoutOutlined,
  KeyOutlined,
  BellOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import logo2 from '../assets/img/logo2.png';
import UserList from './UserList';
import About from './About';
import ChangePassword from '../components/ChangePassword';
import './HomeTabsCustom.scss';
import * as echarts from 'echarts';

const { Header, Sider, Content, Footer } = Layout;
const { TabPane } = Tabs;

const HomeDashboard = () => {
  const lineRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    // 折线图
    const lineChart = echarts.init(lineRef.current);
    lineChart.setOption({
      title: { text: '一周访问量趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'] },
      yAxis: { type: 'value' },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: { color: '#1890ff' },
        itemStyle: { color: '#1890ff' }
      }]
    });
    // 饼图
    const pieChart = echarts.init(pieRef.current);
    pieChart.setOption({
      title: { text: '用户类型分布', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, left: 'center' },
      series: [{
        name: '用户类型',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 1048, name: '学生' },
          { value: 735, name: '教师' },
          { value: 580, name: '管理员' }
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' }
        }
      }]
    });
    // 销毁实例
    return () => {
      lineChart.dispose();
      pieChart.dispose();
    };
  }, []);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card title="用户总数" bordered={false} style={{ fontSize: 18 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>128</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="今日活跃" bordered={false} style={{ fontSize: 18 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>23</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="新增用户" bordered={false} style={{ fontSize: 18 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>5</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="系统消息" bordered={false} style={{ fontSize: 18 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f5222d' }}>2</div>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="数据趋势" bordered={false} style={{ minHeight: 340 }}>
            <div ref={lineRef} style={{ width: '100%', height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户类型分布" bordered={false} style={{ minHeight: 340 }}>
            <div ref={pieRef} style={{ width: '100%', height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const tabConfig = [
  { key: '/home', title: '首页', content: <HomeDashboard /> },
  { key: '/home/user', title: '用户管理', content: <UserList /> },
  { key: '/home/about', title: '关于', content: <About /> },
];

const Home = () => {
  const history = useHistory();
  const location = useLocation();

  const [tabs, setTabs] = useState([tabConfig[0]]);
  const [activeKey, setActiveKey] = useState('/home');
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  const handleMenuClick = (key) => {
    const exist = tabs.find(tab => tab.key === key);
    if (!exist) {
      const tab = tabConfig.find(t => t.key === key);
      if (tab) setTabs([...tabs, tab]);
    }
    setActiveKey(key);
    history.push(key);
  };

  const onTabChange = (key) => {
    setActiveKey(key);
    history.push(key);
  };

  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      let newTabs = tabs.filter(tab => tab.key !== targetKey);
      if (newTabs.length === 0) newTabs = [tabConfig[0]];
      setTabs(newTabs);
      const newActive = targetKey === activeKey ? newTabs[newTabs.length - 1].key : activeKey;
      setActiveKey(newActive);
      history.push(newActive);
    }
  };

  // 右键菜单处理
  const handleTabContextMenu = (e, targetKey) => {
    e.preventDefault();
    const currentIndex = tabs.findIndex(tab => tab.key === targetKey);
    
    const menuItems = [
      {
        key: 'closeCurrent',
        icon: <CloseOutlined />,
        label: '关闭当前',
        onClick: () => onEdit(targetKey, 'remove')
      },
      {
        key: 'closeLeft',
        icon: <CloseOutlined />,
        label: '关闭左边菜单栏',
        disabled: currentIndex <= 0,
        onClick: () => {
          const newTabs = tabs.slice(currentIndex);
          if (newTabs.length === 0) newTabs = [tabConfig[0]];
          setTabs(newTabs);
          const newActive = activeKey === targetKey ? newTabs[0].key : activeKey;
          setActiveKey(newActive);
          history.push(newActive);
        }
      },
      {
        key: 'closeRight',
        icon: <CloseOutlined />,
        label: '关闭右边菜单栏',
        disabled: currentIndex >= tabs.length - 1,
        onClick: () => {
          const newTabs = tabs.slice(0, currentIndex + 1);
          setTabs(newTabs);
          const newActive = activeKey === targetKey ? newTabs[newTabs.length - 1].key : activeKey;
          setActiveKey(newActive);
          history.push(newActive);
        }
      },
      {
        key: 'closeAll',
        icon: <CloseOutlined />,
        label: '全部关闭',
        onClick: () => {
          setTabs([tabConfig[0]]);
          setActiveKey(tabConfig[0].key);
          history.push(tabConfig[0].key);
        }
      }
    ];

    const menu = (
      <Menu items={menuItems} />
    );

    // 显示右键菜单
    const dropdown = document.createElement('div');
    dropdown.style.position = 'fixed';
    dropdown.style.left = e.clientX + 'px';
    dropdown.style.top = e.clientY + 'px';
    dropdown.style.zIndex = 1000;
    document.body.appendChild(dropdown);

    const handleClickOutside = () => {
      document.body.removeChild(dropdown);
      document.removeEventListener('click', handleClickOutside);
    };

    document.addEventListener('click', handleClickOutside);

    // 渲染菜单
    const root = ReactDOM.createRoot(dropdown);
    root.render(menu);
  };

  React.useEffect(() => {
    const current = tabConfig.find(tab => tab.key === location.pathname);
    if (current && !tabs.find(tab => tab.key === current.key)) {
      setTabs([...tabs, current]);
    }
    if (current) setActiveKey(current.key);
  }, [location.pathname]);

  const handleLogout = () => {
    history.push('/');
  };

  const handleChangePassword = () => {
    setChangePasswordVisible(true);
  };

  const userMenu = (
    <Menu style={{ minWidth: 200, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      <Menu.Item key="profile" style={{ height: 60, lineHeight: '60px', padding: '8px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: '#1890ff', 
              marginRight: 16,
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: 16, 
              color: '#262626',
              marginBottom: 2,
              lineHeight: '20px'
            }}>
              系统管理员
            </div>
            <div style={{ 
              fontSize: 13, 
              color: '#8c8c8c',
              lineHeight: '16px'
            }}>
              admin@jiaowu.com
            </div>
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider style={{ margin: '4px 0' }} />
      <Menu.Item key="settings" icon={<SettingOutlined />} style={{ height: 40, lineHeight: '40px' }}>
        系统设置
      </Menu.Item>
      <Menu.Item key="changePassword" icon={<KeyOutlined />} onClick={handleChangePassword} style={{ height: 40, lineHeight: '40px' }}>
        修改密码
      </Menu.Item>
      <Menu.Item key="notifications" icon={<BellOutlined />} style={{ height: 40, lineHeight: '40px' }}>
        <Badge count={3} size="small">
          <span>消息通知</span>
        </Badge>
      </Menu.Item>
      <Menu.Divider style={{ margin: '4px 0' }} />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout} style={{ height: 40, lineHeight: '40px', color: '#ff4d4f' }}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: '100vh', minHeight: '100vh', overflow: 'hidden' }}>
      <Sider style={{ background: '#001529', height: '100vh' }}>
        <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo2} alt="logo" style={{ height: 40, marginRight: 8 }} />
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>后台管理</span>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[activeKey]} style={{ borderRight: 0 }}>
          <Menu.Item key="/home" icon={<AppstoreOutlined />} onClick={() => handleMenuClick('/home')}>
            首页
          </Menu.Item>
          <Menu.Item key="/home/user" icon={<TeamOutlined />} onClick={() => handleMenuClick('/home/user')}>
            用户管理
          </Menu.Item>
          <Menu.Item key="/home/about" icon={<InfoCircleOutlined />} onClick={() => handleMenuClick('/home/about')}>
            关于
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px #f0f1f2', 
          height: 64 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CrownOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 8 }} />
            <span style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>教务管理系统</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={5} size="small" style={{ marginRight: 16 }}>
              <BellOutlined style={{ fontSize: 18, color: '#666', cursor: 'pointer' }} />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              <div style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: 8,
                transition: 'all 0.3s',
                border: '1px solid transparent',
                ':hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#d9d9d9'
                }
              }}>
                <Avatar 
                  size={36} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: '#1890ff', 
                    marginRight: 12,
                    boxShadow: '0 2px 6px rgba(24, 144, 255, 0.2)'
                  }}
                />
                <div style={{ marginRight: 8 }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#262626', 
                    fontSize: 14,
                    lineHeight: '18px'
                  }}>
                    系统管理员
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#8c8c8c',
                    lineHeight: '14px'
                  }}>
                    admin@jiaowu.com
                  </div>
                </div>
                <UserOutlined style={{ fontSize: 12, color: '#bfbfbf' }} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: 0, padding: 0, background: '#f6f8fa', height: 'calc(100vh - 64px - 50px)', minHeight: 0, borderRadius: 0, boxShadow: 'none', overflow: 'auto' }}>
          <Tabs
            hideAdd
            type="editable-card"
            activeKey={activeKey}
            onChange={onTabChange}
            onEdit={onEdit}
            className="custom-tabs"
            tabBarStyle={{ height: 40, fontSize: 14, marginBottom: 0 }}
            style={{ margin: 0, height: '100%' }}
            onTabClick={(key, e) => {
              // 阻止默认的点击事件，让右键菜单能够正常工作
              e.stopPropagation();
            }}
          >
            {tabs.map(tab => (
              <TabPane
                tab={
                  <span 
                    onContextMenu={(e) => handleTabContextMenu(e, tab.key)}
                    style={{ display: 'inline-block', width: '100%' }}
                  >
                    {tab.title}
                  </span>
                }
                key={tab.key}
                closable={tab.key !== '/home'}
                style={{ height: '100%' }}
              >
                <div style={{ padding: 24, minHeight: 'calc(100vh - 112px - 50px)', background: '#fff', height: '100%' }}>
                  {tab.content}
                </div>
              </TabPane>
            ))}
          </Tabs>
        </Content>
        <Footer style={{ 
          textAlign: 'center', 
          background: '#fff', 
          borderTop: '1px solid #f0f0f0',
          padding: '12px 24px',
          height: 50,
          lineHeight: '26px'
        }}>
          <div style={{ color: '#666', fontSize: '12px' }}>
            © 2024 教务管理系统. All Rights Reserved. | 
            <span style={{ marginLeft: 8, color: '#999' }}>
              技术支持：教务管理团队 | 版本：v1.0.0
            </span>
          </div>
        </Footer>
      </Layout>
      <ChangePassword 
        visible={changePasswordVisible} 
        onCancel={() => setChangePasswordVisible(false)} 
      />
    </Layout>
  );
};

export default Home;

import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Dropdown, Tabs, Card, Row, Col } from 'antd';
import { UserOutlined, LogoutOutlined, AppstoreOutlined, InfoCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import logo2 from '../assets/img/logo2.png';
import UserList from './UserList';
import About from './About';
import './HomeTabsCustom.scss';
import * as echarts from 'echarts';

const { Header, Sider, Content } = Layout;
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
  const { path } = useRouteMatch();

  const [tabs, setTabs] = useState([tabConfig[0]]);
  const [activeKey, setActiveKey] = useState('/home');

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

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人中心
      </Menu.Item>
      <Menu.Item key="logout" icon={<UserOutlined />} onClick={handleLogout}>
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
        <Header style={{ background: '#fff', padding: 0, textAlign: 'right', paddingRight: 24, boxShadow: '0 2px 8px #f0f1f2', height: 64, lineHeight: '64px' }}>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <span style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              <UserOutlined style={{ marginRight: 8 }} />个人中心
            </span>
          </Dropdown>
        </Header>
        <Content style={{ margin: 0, padding: 0, background: '#f6f8fa', height: 'calc(100vh - 64px)', minHeight: 0, borderRadius: 0, boxShadow: 'none', overflow: 'auto' }}>
          <Tabs
            hideAdd
            type="editable-card"
            activeKey={activeKey}
            onChange={onTabChange}
            onEdit={onEdit}
            className="custom-tabs"
            tabBarStyle={{ height: 48, fontSize: 16, marginBottom: 0 }}
            style={{ margin: 0, height: '100%' }}
          >
            {tabs.map(tab => (
              <TabPane
                tab={tab.title}
                key={tab.key}
                closable={tab.key !== '/home'}
                style={{ height: '100%' }}
              >
                <div style={{ padding: 24, minHeight: 'calc(100vh - 112px)', background: '#fff', height: '100%' }}>
                  {tab.content}
                </div>
              </TabPane>
            ))}
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;

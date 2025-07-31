import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  CrownOutlined,
  MenuOutlined,
  FileOutlined,
  FolderOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TableOutlined,
  FormOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BookOutlined,
  FileTextOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  CloudOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ToolOutlined,
  SafetyOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  ShopOutlined,
  CarOutlined,
  RocketOutlined,
  StarOutlined,
  HeartOutlined,
  LikeOutlined,
  DislikeOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
  TrophyOutlined,
  GiftOutlined,
  FireOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  ExperimentOutlined,
  CompassOutlined,
  FlagOutlined
} from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import logo2 from '../assets/img/logo2.png';
import ChangePassword from './ChangePassword';
import { moduleAPI } from '../api/module';
import '../views/HomeTabsCustom.scss';
import './LayoutTabs.scss';

const { Header, Sider, Content, Footer } = Layout;
const { TabPane } = Tabs;

const MainLayout = ({ children }) => {
  const history = useHistory();
  const location = useLocation();

  const [tabs, setTabs] = useState([]);
  const [activeKey, setActiveKey] = useState('/home');
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  // 加载模块菜单
  const loadModuleMenu = async () => {
    setMenuLoading(true);
    try {
      const response = await moduleAPI.getModuleTree();
      const modules = response.data || response;
      const menuData = processMenuData(modules);
      setMenuItems(menuData);
    } catch (error) {
      // 如果加载失败，使用默认菜单
      const defaultMenuItems = [
        {
          key: '/home',
          icon: <AppstoreOutlined />,
          label: '首页'
        },
        {
          key: '/system/user',
          icon: <TeamOutlined />,
          label: '用户管理'
        },
        {
          key: '/system/module',
          icon: <AppstoreOutlined />,
          label: '模块管理'
        },
        {
          key: '/sys/student',
          icon: <UserOutlined />,
          label: '学生管理'
        }
      ];
      setMenuItems(defaultMenuItems);
    } finally {
      setMenuLoading(false);
    }
  };

  // 检查模块是否应该显示在菜单中
  const shouldShowInMenu = (module) => {
    // 如果模块没有必要的属性，使用默认值
    const moduleType = module.moduleType || 1;
    const isVisible = module.isVisible !== undefined ? module.isVisible : 1;
    const isEnabled = module.isEnabled !== undefined ? module.isEnabled : 1;
    const path = module.path || module.moduleCode || `/${module.moduleName}`;
    
    const shouldShow = moduleType === 1 && 
           isVisible === 1 && 
           isEnabled === 1 &&
           path; // 确保有路径
    
    return shouldShow;
  };

  // 处理菜单数据
  const processMenuData = (modules) => {
    const menuData = [];
    
    // 添加首页
    menuData.push({
      key: '/home',
      icon: <AppstoreOutlined />,
      label: '首页'
    });

    // 确保modules是数组
    if (!Array.isArray(modules)) {
      return menuData;
    }

    // 处理模块数据
    modules.forEach(module => {
      // 只显示符合条件的模块
      if (shouldShowInMenu(module)) {
        const path = module.path || module.moduleCode || `/${module.moduleName}`;
        const menuItem = {
          key: path, // 使用处理后的path
          icon: getMenuIcon(module.icon, module.moduleType),
          label: module.moduleName,
          moduleData: module // 保存完整的模块数据
        };

        // 如果有子模块，递归处理
        if (module.children && module.children.length > 0) {
          menuItem.children = processSubMenuData(module.children);
        }

        menuData.push(menuItem);
      }
    });

    return menuData;
  };

  // 处理子菜单数据
  const processSubMenuData = (children) => {
    return children
      .filter(child => shouldShowInMenu(child)) // 只显示符合条件的模块
      .map(child => {
        const path = child.path || child.moduleCode || `/${child.moduleName}`;
        return {
          key: path, // 使用处理后的path
          icon: getMenuIcon(child.icon, child.moduleType),
          label: child.moduleName,
          moduleData: child, // 保存完整的模块数据
          children: child.children && child.children.length > 0 ? processSubMenuData(child.children) : undefined
        };
      });
  };

  // 获取菜单图标
  const getMenuIcon = (icon, moduleType) => {
    // 如果有指定的图标，优先使用
    if (icon) {
      const iconMap = {
        'UserOutlined': <UserOutlined />,
        'TeamOutlined': <TeamOutlined />,
        'AppstoreOutlined': <AppstoreOutlined />,
        'InfoCircleOutlined': <InfoCircleOutlined />,
        'DashboardOutlined': <DashboardOutlined />,
        'TableOutlined': <TableOutlined />,
        'FormOutlined': <FormOutlined />,
        'CalendarOutlined': <CalendarOutlined />,
        'BarChartOutlined': <BarChartOutlined />,
        'PieChartOutlined': <PieChartOutlined />,
        'LineChartOutlined': <LineChartOutlined />,
        'BookOutlined': <BookOutlined />,
        'FileTextOutlined': <FileTextOutlined />,
        'PictureOutlined': <PictureOutlined />,
        'VideoCameraOutlined': <VideoCameraOutlined />,
        'AudioOutlined': <AudioOutlined />,
        'CloudOutlined': <CloudOutlined />,
        'DatabaseOutlined': <DatabaseOutlined />,
        'ApiOutlined': <ApiOutlined />,
        'ToolOutlined': <ToolOutlined />,
        'SafetyOutlined': <SafetyOutlined />,
        'LockOutlined': <LockOutlined />,
        'KeyOutlined': <KeyOutlined />,
        'BellOutlined': <BellOutlined />,
        'MailOutlined': <MailOutlined />,
        'PhoneOutlined': <PhoneOutlined />,
        'GlobalOutlined': <GlobalOutlined />,
        'EnvironmentOutlined': <EnvironmentOutlined />,
        'HomeOutlined': <HomeOutlined />,
        'ShopOutlined': <ShopOutlined />,
        'CarOutlined': <CarOutlined />,
        'RocketOutlined': <RocketOutlined />,
        'StarOutlined': <StarOutlined />,
        'HeartOutlined': <HeartOutlined />,
        'LikeOutlined': <LikeOutlined />,
        'DislikeOutlined': <DislikeOutlined />,
        'SmileOutlined': <SmileOutlined />,
        'FrownOutlined': <FrownOutlined />,
        'MehOutlined': <MehOutlined />,
        'CrownOutlined': <CrownOutlined />,
        'TrophyOutlined': <TrophyOutlined />,
        'GiftOutlined': <GiftOutlined />,
        'FireOutlined': <FireOutlined />,
        'ThunderboltOutlined': <ThunderboltOutlined />,
        'BulbOutlined': <BulbOutlined />,
        'ExperimentOutlined': <ExperimentOutlined />,
        'CompassOutlined': <CompassOutlined />,
        'FlagOutlined': <FlagOutlined />,
        'MenuOutlined': <MenuOutlined />,
        'SettingOutlined': <SettingOutlined />,
        'FolderOutlined': <FolderOutlined />,
        'FileOutlined': <FileOutlined />
      };
      
      if (iconMap[icon]) {
        return iconMap[icon];
      }
    }
    
    // 如果没有指定图标，根据类型返回默认图标
    switch (moduleType) {
      case 1: // 菜单
        return <MenuOutlined />;
      case 2: // 按钮
        return <FileOutlined />;
      case 3: // 页面
        return <FileOutlined />;
      default:
        return <FolderOutlined />;
    }
  };

  // 组件加载时获取菜单数据
  useEffect(() => {
    loadModuleMenu();
  }, []);

  // 初始化菜单展开状态和页签
  useEffect(() => {
    if (menuItems.length > 0) {
      // 找到当前路径对应的父菜单，并展开
      const findParentKey = (items, currentPath) => {
        for (let item of items) {
          if (item.children) {
            for (let child of item.children) {
              if (child.key === currentPath) {
                return item.key;
              }
            }
            const parentKey = findParentKey(item.children, currentPath);
            if (parentKey) return parentKey;
          }
        }
        return null;
      };

      const parentKey = findParentKey(menuItems, location.pathname);
      if (parentKey && !openKeys.includes(parentKey)) {
        setOpenKeys([...openKeys, parentKey]);
      }

      // 初始化页签
      if (tabs.length === 0) {
        // 添加首页页签
        const homeMenuItem = menuItems.find(item => item.key === '/home');
        if (homeMenuItem) {
          const homeTab = {
            key: '/home',
            label: homeMenuItem.label,
            icon: homeMenuItem.icon,
            closable: false
          };
          setTabs([homeTab]);
          setActiveKey('/home');
        }
      }
    }
  }, [menuItems, location.pathname]);

  // 监听路由变化，确保页签同步
  useEffect(() => {
    if (menuItems.length > 0) {
      addTab(location.pathname);
    }
  }, [location.pathname, menuItems]);

  const handleMenuClick = (key) => {
    history.push(key);
    // 保持菜单展开状态，不清除selectedKeys
  };

  // 添加页签
  const addTab = useCallback((key) => {
    // 查找对应的菜单项
    const findMenuItem = (items, targetKey) => {
      for (let item of items) {
        if (item.key === targetKey) {
          return item;
        }
        if (item.children) {
          const found = findMenuItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const menuItem = findMenuItem(menuItems, key);
    
    if (menuItem) {
      const newTab = {
        key: key,
        label: menuItem.label,
        icon: menuItem.icon,
        closable: key !== '/home' // 首页不可关闭
      };

      setTabs(prevTabs => {
        // 检查页签是否已存在
        const existingTab = prevTabs.find(tab => tab.key === key);
        if (!existingTab) {
          const newTabs = [...prevTabs, newTab];
          return newTabs;
        }
        return prevTabs;
      });

      // 更新activeKey
      setActiveKey(key);
    }
  }, [menuItems]);

  // 关闭页签
  const removeTab = (targetKey) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.key !== targetKey);
      
      // 如果关闭的是当前页签，需要切换到其他页签
      if (targetKey === activeKey && newTabs.length > 0) {
        const currentIndex = prevTabs.findIndex(tab => tab.key === targetKey);
        const newActiveKey = newTabs[currentIndex] || newTabs[currentIndex - 1] || newTabs[0];
        setActiveKey(newActiveKey.key);
        history.push(newActiveKey.key);
      }
      
      return newTabs;
    });
  };

  // 页签切换
  const handleTabChange = (key) => {
    setActiveKey(key);
    history.push(key);
  };

  // 处理菜单展开状态
  const handleMenuOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  // 渲染菜单项
  const renderMenuItem = (item) => {
    if (item.children && item.children.length > 0) {
      return (
        <Menu.SubMenu 
          key={item.key} 
          icon={item.icon} 
          title={item.label}
        >
          {item.children.map(child => renderMenuItem(child))}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item 
          key={item.key} 
          icon={item.icon} 
          onClick={() => handleMenuClick(item.key)}
        >
          {item.label}
        </Menu.Item>
      );
    }
  };

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
      <Sider 
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: '#001529', height: '100vh' }}
        trigger={null}
      >
        <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo2} alt="logo" style={{ height: 40, marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 22 }}>后台管理</span>}
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          openKeys={openKeys}
          onOpenChange={handleMenuOpenChange}
          collapsed={collapsed}
          style={{ borderRight: 0 }}
          loading={menuLoading}
        >
          {menuItems.map(item => renderMenuItem(item))}
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
            <div 
              style={{ 
                cursor: 'pointer', 
                padding: '8px', 
                borderRadius: '4px',
                marginRight: 16,
                transition: 'all 0.3s',
                ':hover': { backgroundColor: '#f5f5f5' }
              }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
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
        {/* 页签区域 */}
        <div style={{ 
          background: '#fff', 
          borderBottom: '1px solid #f0f0f0',
          padding: '0 24px',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'flex', 
            flex: 1, 
            overflow: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}>
            {tabs.map(tab => (
              <div
                key={tab.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  margin: '0 4px 0 0',
                  borderRadius: '6px 6px 0 0',
                  border: '1px solid #d9d9d9',
                  borderBottom: 'none',
                  background: activeKey === tab.key ? '#fff' : '#fafafa',
                  color: activeKey === tab.key ? '#1890ff' : '#666',
                  cursor: 'pointer',
                  minWidth: '120px',
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'all 0.3s'
                }}
                onClick={() => handleTabChange(tab.key)}
              >
                <span style={{ marginRight: 4, fontSize: '14px' }}>{tab.icon}</span>
                <span style={{ fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tab.label}
                </span>
                {tab.closable && (
                  <span
                    style={{
                      marginLeft: 8,
                      color: '#999',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTab(tab.key);
                    }}
                  >
                    ×
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <Content style={{ margin: 0, padding: 0, background: '#f6f8fa', height: 'calc(100vh - 64px - 40px - 50px)', minHeight: 0, borderRadius: 0, boxShadow: 'none', overflow: 'hidden' }}>
          <div style={{ padding: 24, background: '#fff', height: '100%', overflow: 'auto' }}>
            {children}
          </div>
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

export default MainLayout; 
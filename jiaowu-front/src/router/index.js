import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MainLayout from '../components/Layout';
import Home from '../views/Home';
import Login from '../components/Login';
import UserList from '../views/UserList';
import ModuleManagement from '../views/ModuleManagement';
import NotFound from '../components/NotFound';

// 动态路由组件
const DynamicRoute = ({ path }) => {
  // 根据路径返回对应的组件
  const getComponent = (path) => {
    switch (path) {
      case '/home':
        return <Home />;
      case '/system/user':
      case '/sys/student':
        return <UserList />;
      case '/system/module':
        return <ModuleManagement />;
      default:
        // 对于未知路径，返回一个通用的页面组件
        return (
          <div style={{ 
            padding: '24px', 
            textAlign: 'center',
            color: '#666'
          }}>
            <h2>页面开发中</h2>
            <p>路径: {path}</p>
            <p>该页面正在开发中，敬请期待...</p>
          </div>
        );
    }
  };

  return (
    <MainLayout>
      {getComponent(path)}
    </MainLayout>
  );
};

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/home" component={() => (
        <MainLayout>
          <Home />
        </MainLayout>
      )} />
      <Route path="/system/user" component={() => (
        <MainLayout>
          <UserList />
        </MainLayout>
      )} />
      <Route path="/system/module" component={() => (
        <MainLayout>
          <ModuleManagement />
        </MainLayout>
      )} />
      <Route path="/sys/student" component={() => (
        <MainLayout>
          <UserList />
        </MainLayout>
      )} />
      {/* 动态路由，处理所有其他路径 */}
      <Route path="*" component={({ location }) => (
        <DynamicRoute path={location.pathname} />
      )} />
    </Switch>
  );
};

export default Routes;

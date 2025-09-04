import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MainLayout from '../components/layout/Layout';
import Home from '../views/Home';
import Login from '../components/platform/Login';
import Employee from '../views/platform/Employee';
import Module from '../views/platform/Module';
import NotFound from '../components/platform/NotFound';
import ReportList from '../views/report/ReportList';
import ReportPreviewPage from '../views/report/ReportPreviewPage'; 


// 主应用路由 - 包含Layout
const AppRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="*" component={MainLayout} />
    </Switch>
  );
};

// Layout内部的路由 - 只处理内容区域
const ContentRoutes = () => {
  return (
    <Switch>
      <Route exact path="/home" component={Home} />
      <Route path="/platform/employee" component={Employee} />
      <Route path="/platform/module" component={Module} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default AppRoutes;
export { ContentRoutes };

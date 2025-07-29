import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './assets/styles/index.scss';
import App from './App';
import { HashRouter } from 'react-router-dom';

moment.locale('zh-cn');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </HashRouter>
);

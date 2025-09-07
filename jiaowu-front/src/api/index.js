import axios from 'axios';
import { authAPI } from './platform/login';
import { Modal } from 'antd';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:9901',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const user = authAPI.getCurrentUser();
    if (user && user.accessToken) {
      config.headers['Authorization'] = 'Bearer ' + user.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 如果是blob响应，返回完整的响应对象
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      if (error.status === 403) {
        Modal.warn({
          title: '鉴权失败',
          content: '鉴权失败，点击返回登陆界面！',
          onOk: () => {
            authAPI.logout();
            localStorage.removeItem('user');
            window.location.href = "/"
          },
        });
      }
      // 服务器返回错误状态码
      const errorMessage = error.response.data?.message || '网络请求失败';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return Promise.reject(new Error('网络连接失败'));
    } else {
      // 请求配置出错
      return Promise.reject(new Error('请求配置错误'));
    }
  },
);

// 通用GET请求
export const get = async (url, params = {}) => {
  return api.get(url, { params });
};

// 通用POST请求
export const post = async (url, data = {}) => {
  return api.post(url, data);
};

// 通用PUT请求
export const put = async (url, data = {}) => {
  return api.put(url, data);
};

// 通用DELETE请求
export const del = async (url) => {
  return api.delete(url);
};

export default api;

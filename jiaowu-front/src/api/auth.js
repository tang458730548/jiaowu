import { post } from './index';

// 认证相关API
export const authAPI = {
  // 获取验证码
  getCaptcha: (sessionId) => {
    return post('/api/verification/generate', { sessionId });
  },

  // 员工登录
  employeeLogin: (data) => {
    return post('/api/login/employee', data);
  },

  // 用户登录
  userLogin: (data) => {
    return post('/api/login/user', data);
  },

  // 退出登录
  logout: () => {
    return post('/api/logout');
  },

  // 获取用户信息
  getUserInfo: () => {
    return post('/api/user/info');
  },

  // 修改密码
  changePassword: (data) => {
    return post('/api/user/changePassword', data);
  },
}; 
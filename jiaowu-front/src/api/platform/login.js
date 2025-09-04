import { post } from '../index';

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
    return post('/api/login/logout');
  },

  // 获取用户信息
  getUserInfo: () => {
    return post('/api/user/info');
  },

  // 修改密码
  changePassword: (data) => {
    return post('/api/user/changePassword', data);
  },

  // 获取当前用户信息
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  // 检查用户是否已登录
  isLoggedIn() {
    const user = this.getCurrentUser();
    return user && user.accessToken;
  },

  // 刷新token
  refreshToken() {
    const user = this.getCurrentUser();
    if (!user || !user.refreshToken) {
      return Promise.reject('No refresh token available');
    }

    return post('/api/login/refresh-token', user.refreshToken)
      .then((response) => {
        if (response.data.accessToken) {
          // 更新存储的token
          user.accessToken = response.data.accessToken;
          localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
      });
  },
};

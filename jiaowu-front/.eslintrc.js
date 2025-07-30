module.exports = {
  extends: ['react-app'],
  rules: {
    // 忽略未使用变量的警告
    'no-unused-vars': 'off',
    
    // 忽略常量重新赋值的警告
    'no-const-assign': 'off',
    
    // 忽略React Hook依赖的警告
    'react-hooks/exhaustive-deps': 'off',
    
    // 忽略未定义变量的警告（如useRouteMatch）
    'no-undef': 'off',
    
    // 其他常用规则
    'no-console': 'off',
    'no-debugger': 'warn',
    'prefer-const': 'warn',
    'no-var': 'error',
    
    // React相关规则
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    
    // 允许使用下划线开头的变量（表示有意未使用）
    'no-unused-vars': ['off', { 'argsIgnorePattern': '^_' }],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
}; 
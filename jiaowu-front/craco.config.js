const CracoAntDesignPlugin = require('craco-antd');
const path = require('path');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
    },
  ],
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};

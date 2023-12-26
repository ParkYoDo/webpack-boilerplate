const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  // Development Mode
  mode: 'development',
  // DevTool : type of source map
  devtool: 'eval-cheap-module-source-map',
  cache: {
    type: 'filesystem',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // 모듈 해석에 사용할 확장자 설정
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheCompression: false,
          cacheDirectory: true,
          presets: [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ],
          plugins: [['babel-plugin-styled-components']],
        },
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
    // plugins: [
    //   webpack.DefinePlugin({
    //     // 'process.env.BASE_URL': JSON.stringify(process.env.DEV_BASE_URL),
    //   }),
    // ],
  },
});

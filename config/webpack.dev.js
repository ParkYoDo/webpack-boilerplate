const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.development') });

module.exports = merge(common, {
  // Development Mode
  mode: 'development',
  // DevTool : type of source map
  devtool: 'eval-cheap-module-source-map',
  // DevServer : 웹팩 개발 서버에 대한 설정
  devServer: {
    open: true, // dev server 구동 후 브라우저 열기
    hot: true, // webpack의 HMR(핫모듈교체) 기능 활성화 : 전체 페이지 새로고침 없이 변경 사항 확인
    compress: true, // 모든 항목에 대해 gzip압축 사용
    port: 8081, // 접속 포트 설정
    historyApiFallback: true, // historyApi 사용 SPA에서 404 응답을 index.html로 redirect
    liveReload: true, // 변경된 내용 자동 새로고침 여부 설정
  },
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  // Module
  module: {
    rules: [
      // Babel-Loader
      {
        test: /\.(js|jsx|ts|tsx)$/i, // js, jsx, ts, tsx에 대해
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
      // Css-Loader
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    // 환경변수
    new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) }),
  ],
  cache: {
    type: 'filesystem',
  },
});

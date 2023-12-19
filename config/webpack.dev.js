const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

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
  cache: {
    type: 'filesystem',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
});

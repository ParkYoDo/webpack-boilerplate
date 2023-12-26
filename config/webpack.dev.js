const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const dotenv = require('dotenv');
// const isLocal = process.env.NODE_ENV === 'local';

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = merge(common, {
  // Development Mode
  mode: 'development',
  // DevTool : type of source map
  devtool: 'eval-cheap-module-source-map',
  // output: {
  //   publicPath: '/', // 브라우저에서 참조될 때 출력 디렉터리의 공용 URL을 지정
  //   filename: '[name].[contenthash].js', // 생성될 파일 이름 hash, contenthash, chunkhash
  // },
  // DevServer : 웹팩 개발 서버에 대한 설정
  devServer: {
    open: true, // dev server 구동 후 브라우저 열기
    hot: true, // webpack의 HMR(핫모듈교체) 기능 활성화 : 전체 페이지 새로고침 없이 변경 사항 확인
    compress: true, // 모든 항목에 대해 gzip압축 사용
    port: 8081, // 접속 포트 설정
    historyApiFallback: true, // historyApi 사용 SPA에서 404 응답을 index.html로 redirect
    liveReload: true, // 변경된 내용 자동 새로고침 여부 설정
  },
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
    new webpack.DefinePlugin({
      // 'process.env.PUBLIC_KEY': JSON.stringify(process.env.PUBLIC_KEY),
      // 'process.env.IS_LOCAL': isLocal,
    }),
  ],
  cache: {
    type: 'filesystem',
  },
  // optimization: {
  //   runtimeChunk: {
  //     name: entrypoint => `runtime-${entrypoint.name}`,
  //   },
  // },
});

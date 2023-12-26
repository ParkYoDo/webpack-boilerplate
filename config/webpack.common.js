const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('progress-webpack-plugin');
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  // Entry : 웹팩의 최초 진입점인 자바스크립트 파일
  entry: path.resolve(__dirname, '../src/index.tsx'),
  // Output : 빌드 시 적용되는 속성에 대한 설정
  output: {
    publicPath: './', // 브라우저에서 참조될 때 출력 디렉터리의 공용 URL을 지정
    path: path.resolve(__dirname, '../dist'), // 번들된 파일을 생성할 경로
    filename: '[name].[contenthash].js', // 생성될 파일 이름 hash, contenthash, chunkhash
    clean: true, // path에 다른 파일들이 있다면, 삭제하고 새로운 파일을 생성
  },
  // Resolve : 모듈을 해석하는 방식을 변경
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.json'], // 설정된 확장자에 해당하는 파일은 import 시 파일 확장자를 명시하지 않아도 된다.
    modules: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../node_modules')], // 목록의 앞에 있는 경로부터 모듈을 탐색한다.
    alias: {
      '@': path.resolve(__dirname, '../src/'), // 절대경로
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|ico|webp)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[name][hash][ext]',
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  // Plugins : 웹팩의 기본적인 동작에 추가적인 기능을 제공
  plugins: [
    // import React from 'react';
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    // 빌드한 결과물을 html 파일로 생성 해주는 Plugin
    new HtmlWebpackPlugin({
      template: 'public/index.html', // index.html 경로
      // favicon: 'public/favicon.ico', // favicon
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: './',
          globOptions: {
            ignore: [
              '**/index.html',
              // '**/favicon.ico'
            ], // 특정 파일 제외 설정
          },
        },
      ],
    }),
    new ProgressPlugin(true),
    // new BundleAnalyzerPlugin(),
  ],
  // DevServer : 웹팩 개발 서버에 대한 설정
  devServer: {
    open: true, // dev server 구동 후 브라우저 열기
    hot: true, // webpack의 HMR(핫모듈교체) 기능 활성화 : 전체 페이지 새로고침 없이 변경 사항 확인
    compress: true, // 모든 항목에 대해 gzip압축 사용
    port: 8081, // 접속 포트 설정
    historyApiFallback: true, // historyApi 사용 SPA에서 404 응답을 index.html로 redirect
    liveReload: true, // 변경된 내용 자동 새로고침 여부 설정
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

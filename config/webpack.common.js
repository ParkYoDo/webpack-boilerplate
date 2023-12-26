const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('progress-webpack-plugin');
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  // Entry : 웹팩의 최초 진입점인 자바스크립트 파일
  entry: path.resolve(__dirname, '../src/index.tsx'),
  // Resolve : 모듈을 해석하는 방식을 변경
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.json'], // 설정된 확장자에 해당하는 파일은 import 시 파일 확장자를 명시하지 않아도 된다.
    modules: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../node_modules')], // 목록의 앞에 있는 경로부터 모듈을 탐색한다.
    alias: {
      '@': path.resolve(__dirname, '../src/'), // 절대경로
    },
  },
  // Module
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|ico|webp)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[name][hash][ext]',
        },
      },
      // font 처리
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // xml 처리
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
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
      template: './public/index.html', // index.html 경로
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          to: './',
          globOptions: {
            ignore: ['**/index.html'], // 특정 파일 제외 설정
          },
        },
      ],
    }),
    new ProgressPlugin(true),
    // new BundleAnalyzerPlugin(),
  ],
};

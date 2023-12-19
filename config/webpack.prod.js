const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  // Production Mode
  mode: 'production',
  // 소스 맵 설정
  devtool: 'inline-source-map',
  // 모듈 설정
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i, // .sass, .scss, css에 대해
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'], // MiniCssExtractPlugin.loader, css-loader, sass-loader를 차례로 사용하여 변환
      },
    ],
  },
  // 플러그인 설정
  plugins: [
    // 빌드 시 기존 파일 정리를 위한 플러그인
    new CleanWebpackPlugin({
      // dist 폴더 내부의 모든 파일 삭제 설정
      cleanOnceBeforeBuildPatterns: ['**/*', path.resolve(process.cwd(), 'dist/**/*')],
    }),
    // CSS 파일 추출을 위한 플러그인
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css', // 번들된 CSS 파일의 이름 설정
      chunkFilename: 'css/[id].[contenthash:8].css', // 청크 파일의 이름 설정
    }),
  ],
  // 최적화 설정
  optimization: {
    usedExports: true, // 사용된 내보내기(exports)만을 포함시키는 설정
    minimize: true, // 코드 압축 여부 설정
    minimizer: [
      // JavaScript 코드 압축 플러그인
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 콘솔(console) 로그 제거 설정
          },
        },
      }),
      // CSS 코드 압축 플러그인
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }, // 주석 제거 설정
            },
          ],
        },
      }),
    ],

    // 공통 의존성 중복 방지
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});

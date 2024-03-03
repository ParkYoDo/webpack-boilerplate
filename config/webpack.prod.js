const webpack = require('webpack');
const path = require('path');
const common = require('./webpack.common');
const dotenv = require('dotenv');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = merge(common, {
  // Production Mode
  mode: 'production',
  // 소스 맵 설정
  devtool: false,
  // Output : 빌드 시 적용되는 속성에 대한 설정
  output: {
    publicPath: '/', // 브라우저에서 참조될 때 출력 디렉터리의 공용 URL을 지정
    path: path.resolve(__dirname, '../dist'), // 번들된 파일을 생성할 경로
    filename: '[name].[chunkhash].js', // 생성될 파일 이름 hash, contenthash, chunkhash / css in js는 chunkhash해도 무관 아니면 contenthash
    clean: true, // path에 다른 파일들이 있다면, 삭제하고 새로운 파일을 생성
  },
  target: ['web', 'es5'],
  // 모듈 설정
  module: {
    rules: [
      // Babel-Loader
      {
        test: /\.(js|jsx|ts|tsx)$/i, // js, jsx, ts, tsx에 대해
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: {
                  version: 3,
                },
              },
            ],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ],
          plugins: [
            [
              'babel-plugin-styled-components',
              {
                displayName: false,
                minify: true,
                transpileTemplateLiterals: true,
                pure: true,
              },
            ],
          ],
        },
      },
      // Css-Loader
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
      // build 폴더 내부의 모든 파일 삭제 설정
      cleanOnceBeforeBuildPatterns: ['**/*', path.resolve(process.cwd(), 'dist/**/*')],
    }),
    // CSS 파일 추출을 위한 플러그인
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css', // 번들된 CSS 파일의 이름 설정
      chunkFilename: 'css/[id].[contenthash:8].css', // 청크 파일의 이름 설정
    }),
    // 환경변수
    new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) }),
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

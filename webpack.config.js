const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname);

const compileNodeModules = [
  'react-native-vector-icons',
  'react-native-youtube-iframe',
  '@react-navigation/native',
  '@react-navigation/native-stack',
  '@react-navigation/elements',
  '@react-navigation/bottom-tabs',
  '@react-native-async-storage/async-storage',
  '@react-native-community/datetimepicker',
].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const appBabelConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: [
    path.resolve(appDirectory, 'index.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'assets'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      babelrc: false,
      configFile: false,
      presets: [
        'module:@react-native/babel-preset',
        ['@babel/preset-env', { modules: false, loose: true }],
      ],
      plugins: [
        'react-native-web',
        [
          'module:react-native-dotenv',
          {
            moduleName: '@env',
            path: '.env',
            safe: false,
            allowUndefined: true,
          },
        ],
      ],
    },
  },
};

const dependencyBabelConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: compileNodeModules,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      babelrc: false,
      configFile: false,
      presets: [
        ['@babel/preset-env', { modules: false, loose: true }],
        '@babel/preset-flow',
        '@babel/preset-react',
      ],
      plugins: [
        'react-native-web',
        '@babel/plugin-transform-flow-strip-types',
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      ],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg|webp)$/,
  type: 'asset',
  parser: { dataUrlCondition: { maxSize: 8192 } },
  generator: { filename: 'assets/[name].[contenthash:8][ext]' },
};

module.exports = (_env, argv = {}) => {
  const isProduction =
    argv.mode === 'production' || process.env.NODE_ENV === 'production';
  return {
    entry: [path.join(appDirectory, 'index.js')],

    mode: isProduction ? 'production' : 'development',

    output: {
      path: path.resolve(appDirectory, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },

    module: {
      rules: [
        appBabelConfiguration,
        dependencyBabelConfiguration,
        imageLoaderConfiguration,
        {
          test: /\.ttf$/,
          type: 'asset/resource',
          generator: { filename: 'assets/[name].[contenthash:8][ext]' },
        },
        {
          test: /\.html$/,
          use: ['html-loader'],
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },

    resolve: {
      alias: {
        'react-native$': 'react-native-web',
        'react-native-webview$': 'react-native-web-webview',
        'react-native-linear-gradient$': path.resolve(
          appDirectory,
          'src/platform/web/LinearGradient.tsx',
        ),
        'react-native-image-picker$': path.resolve(
          appDirectory,
          'src/platform/web/ImagePicker.ts',
        ),
        '@react-native-documents/picker$': path.resolve(
          appDirectory,
          'src/platform/web/DocumentPicker.ts',
        ),
      },
      mainFields: ['browser', 'module', 'main'],
      extensions: [
        '.web.js',
        '.web.tsx',
        '.web.ts',
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(appDirectory, 'index.html'),
        inject: true,
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
      }),
    ],

    devServer: {
      historyApiFallback: true,
      port: 8080,
      hot: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
  };
};

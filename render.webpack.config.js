/* eslint-disable */

const fs = require('fs');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');


let entries = {};

const files = fs.readdirSync('./src');

files.forEach(function (filename) {
  let stat = fs.lstatSync('./src/' + filename);
  if (stat.isFile() === true) {

    const ext = path.extname(filename);
    if (ext === '.vue') {
      const basename = path.basename(filename, ext);
      entries[basename] = `./src/${filename}`;
    }
  }
});

const defaultConfig = {
  entry: {},
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, './dist'),
    library: '[name]',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            useRelativePath: true,
            outputPath: 'assets',
            publicPath: 'extends/components/assets',
          }
        }]
      },
      {
        test: /\.ts|\.tsx$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/.vue$/],
            }
          }
        ],
      },
      {
        test: /\.js(x)*$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.vue', '.js', '.ts', '.jpg', '.png'],
    alias: {
      vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js')
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(
      {
        filename: './[name]/index.css'
      })
  ],

  externals: {
    vue: "Vue"
  }
};

module.exports = Object.assign(defaultConfig, { entry: entries });

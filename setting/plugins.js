const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const os = require('os');

const production = process.env.NODE_ENV === 'production';

const basePlugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names: ['pass', 'vendor'],
  }),
  new CopyWebpackPlugin([
    { from: './app/images', to: 'images' },
  ]),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './app/views/index.ejs',
  }),
  new ExtractTextPlugin({
    filename: production ? '[name].[chunkhash].css' : '[name].css',
    disable: false,
    allChunks: true,
  }),
];

const watchPlugins = [
  new HappyPack({
    id: 'babel',
    threads: 6,
    loaders: ['babel-loader'],
  }),
  new Visualizer({
    filename: './statistics.html',
  }),
];

const buildPlugins = [
  new HappyPack({
    id: 'babel',
    threads: 6,
    loaders: ['babel-loader'],
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  // new webpack.optimize.UglifyJsPlugin({ // 体积小了, 但速度太慢了
  //   beautify: false,
  //   comments: false,
  //   compress: {
  //     warnings: false,
  //     collapse_vars: true,
  //     reduce_vars: true,
  //   },
  // }),
  // new UglifyJsParallelPlugin({ // 发版多个，多核是累赘，反而更慢了
  //   workers: os.cpus().length,
  //   output: {
  //     ascii_only: true,
  //   },
  //   compress: {
  //     warnings: false,
  //   },
  // }),
];

module.exports = production ? basePlugins.concat(buildPlugins) : basePlugins.concat(watchPlugins);

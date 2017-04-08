'use strict';
/**
 * npm run watch:server
 * 使用 koa 启动一个服务, 用于develop模式
 * 或者使用 express 以及相应的中间件
 */
import Koa from 'koa';
import convert from 'koa-convert'; // 用于转换generator写法, 以支持Koa2.0
import server from 'koa-static';
import proxy from 'koa-proxy';
import historyApiFallback from 'koa-connect-history-api-fallback';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import _util from '../setting/util';
import _webpackConfig from '../webpack.config';

// 获取基本配置
const app = new Koa();
const webpackConfig = _webpackConfig(null, process);
const settings = _util.settings;
'use strict';
/**
 * npm run watch:server
 * 使用 koa 启动一个服务, 用于 develop 模式, 非生产模式
 * 或者使用 express 以及相应的中间件
 */
import Koa from 'koa';
import convert from 'koa-convert'; // 用于转换generator写法, 以支持Koa2.0
import server from 'koa-static';
import proxy from 'koa-proxy';
import Router from 'koa-router';
import KoaBody from 'koa-better-body';
import historyApiFallback from 'koa-connect-history-api-fallback';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import DashboardPlugin from 'webpack-dashboard/plugin';
import OpenBrowserWebpackPlugin from 'open-browser-webpack-plugin';
import webpack from 'webpack';
import Ip from 'ip';
import _util from '../setting/util';
import _webpackConfig from '../webpack.config';

// 获取基本配置
const path = require('path');
const app = new Koa();
const router = new Router();
const koaBody = KoaBody()
const webpackConfig = _webpackConfig(null, process);
const _ROOT_DIR_ = path.resolve(__dirname, '..');
const settings = _util.settings;
const port = settings.httpPort;

// 启动api服务器, 获取mock服务
if (settings.mock) {
  require('../mock/users')(router)

} else {
  app.use(convert(proxy({
    host: `http://${settings.remote}`,
    match: /^\/api\/.*/, // 拦截后台接口, 一般是 /api 开头
  })));
}
// 加载路由, 在加载静态资源之前
app.use(convert(koaBody))
app.use(router.routes()).use(router.allowedMethods());

// 让 url 永远指向 index.jsx 方便 react-outer
app.use(convert(historyApiFallback({
  verbose: false, // 取消日志消息
})));

_util.debug('👽 开发模式配置加载完成');
// 加载热部署相关
_util.debug('🐞 开发模式启用热部署插件 (HMR, NoErrors).');
webpackConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  // new webpack.NoErrorsPlugin(),
  new OpenBrowserWebpackPlugin({ url: `http://localhost:${port}` }),
);
// 加载webpack配置, 并启动打包
const compiler = webpack(webpackConfig);
compiler.apply(new DashboardPlugin());
app.use(convert(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: path.resolve(_ROOT_DIR_, 'app'),
  lazy: false,  // 服务一起动开始 webpack 编译
  hot: true,
  quiet: true, // 是否在 console 里面显示信息
  noInfo: true, // 是否在命令行中显示错误
  stats: {
    colors: true,
    assets: false,  // 下面减少日志的设置不起效果, 日。 webpack-dashboard 0.0.3 bug, see https://github.com/FormidableLabs/webpack-dashboard/issues/163, 等待中新Tag。。。
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    children: false
  },
  historyApiFallback: true,
})));
// 启用热部署插件
app.use(convert(webpackHotMiddleware(compiler)));
// 静态文件请求
app.use(convert(server(path.resolve(_ROOT_DIR_, 'public'))));

// 监听
app.listen(port, (err) => {
  if (err) {
    _util.debug(err);
  }
  _util.debug(`🚀 外网访问: http://${Ip.address()}:${port}`);
  _util.debug(`💻 本机测试: http://localhost:${port}`);
});
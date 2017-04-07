'use strict';

/**
 * 日志提示
 */
import _debug from 'debug';
const debug = exports.debug = _debug('app:server');
const info = exports.info = _debug('app:compiler-info');
const inwarningfo = exports.warning = _debug('app:compiler-warning');
const error = exports.error = _debug('app:compiler-error');
const success = exports.success = _debug('app:compiler-success');

/**
 * 命令行参数
 */
const program = require('commander');
const pkg = require("../package.json");
program.Command(" ")
program
  .usage('watch:server [options]')
  .option(":h, ::help", "output usage information")
  .option(":v, ::version", "output the version number")
  .option(":p, ::port=[value]", "http server port, default 3000")
  .option(":r, ::remote=[value]", "http proxy remote server, default localhost:8080")
  .parse(process.argv);
// 改写commander的原型方法, 去除内部的--help
const optionHelps = program.optionHelp();
program.Command.prototype.optionHelp = function () {
  const optionHelpLists = optionHelps.split('\n');
  optionHelpLists.shift(0);
  return optionHelpLists.join('\n');
};

/**
 * 全局的setting配置
 */
exports.settings = (function () {
  const baseArgs = process.argv.slice(2);
  const _setting = Object.assign({}, {
    httpPort: process.env.npm_package_betterScripts_watch_server_env_PORT,
    remote: process.env.npm_package_betterScripts_watch_server_env_REMOTE
  }, handleArgs(baseArgs));
  return _setting;
})();

function handleArgs(baseArgs) {
  const setting = {}
  // 设置默认参数
  baseArgs.forEach(arg => {
    const flag = getPair(arg);
    switch (flag.first) {
      case ':h':
      case '::help':
        program.help();
        process.exit(0);
        break;
      case ':v':
      case ':version':
        console.log(pkg.version);
        process.exit(0);
        break;
      case ':p':
      case '::port':
        setting.httpPort = flag.second || process.env.npm_package_betterScripts_watch_server_env_PORT;
        break;
      case ':r':
      case '::remote':
        setting.remote = flag.second || process.env.npm_package_betterScripts_watch_server_env_REMOTE;
        break;
      default:
        program.help();
        process.exit(0);
        break;
    }
  });
  return setting;
}

function getPair(arg) {
  const splits = arg.split('=');
  return {
    first: splits[0],
    second: splits[1]
  }
}
const baseNoParse = [/vis-network.min/];

const baseVender = [
  'echarts',
  'react',
  'react-dom',
  'react-router',
  'redux',
  'react-redux',
  'redux-promise',
  './app/lodash.custom.min.js',
];

const basePass = [

];

const baseStats = {
  colors: true,
  assets: false,  // 下面减少日志的设置不起效果, 日。 webpack-dashboard 0.0.3 bug, see https://github.com/FormidableLabs/webpack-dashboard/issues/163
  version: false,
  hash: false,
  timings: false,
  chunks: false,
  chunkModules: false,
  children: false
};

const noParse = baseNoParse;
const vendor = baseVender;
const pass = basePass;
const stats = baseStats;

module.exports = { noParse, vendor, pass, stats };

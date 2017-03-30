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

const noParse = baseNoParse;
const vendor = baseVender;
const pass = basePass;

module.exports = { noParse, vendor, pass };

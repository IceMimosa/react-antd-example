const ignoreArray = [
  '.map$',
  'xterm.js', 'terminal.js', 'docker.js',
  'builder-status.jsx', 'builders-manage.jsx',
];

const replacePoint = (str) => { // 替换点
  return str ? `(${str.replace(/\./g, '\\.')})` : '';
};

const addOrSymbol = (length, index) => { // 增加或符号
  return index + 1 < length ? '|' : '';
};

const convertToReg = (array = []) => {
  let regString = '';
  const length = array.length;
  array.forEach((single, index) => {
    regString = regString + replacePoint(single) + addOrSymbol(length, index);
  });
  return regString;
};

const ignorePattern = new RegExp(convertToReg(ignoreArray));

module.exports = { ignorePattern };

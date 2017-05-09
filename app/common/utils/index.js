import path from 'path-browserify';
import { notification } from 'antd';

export function refTo(key) {
  return (ref) => {
    this[key] = ref;
  };
}

export const camel2Underscore = (str, options = { upperCase: false }) => {
  const underscoreStr = str.replace(/[A-Z]+/g, '_$&');
  return options.upperCase ? underscoreStr.toUpperCase() : underscoreStr.toLowerCase();
};

export const isPromise = (obj) => {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
};

const validKeys = [
  'type',
  'payload',
  'error',
  'meta',
];

function isValidKey(key) {
  return validKeys.indexOf(key) > -1;
}

export function isFSA(action) {
  return (
    _.isPlainObject(action) &&
    typeof action.type !== 'undefined' &&
    Object.keys(action)
      .every(isValidKey)
  );
}

export function withProfile(profiles = [], comp) {
  let isShow = false;
  if (Array.isArray(profiles)) {
    profiles.forEach((p) => {
      if (p === window._profile_) {
        isShow = true;
      }
    });
  } else {
    isShow = profiles === window._profile_;
  }

  return isShow ? comp : React.createElement('div');
}

export function resolvePath(goPath) {
  return path.resolve(window.location.pathname, goPath);
}

export function getEnvName(envType) {
  return {
    PRO: '生产',
    PRE: '预发',
    DEV: '开发',
    TEST: '测试',
  }[envType];
}

export function px2Int(pxStr) {
  return parseInt(pxStr.replace('px', ''), 10);
}

export function getMainViewHeight() {
  const mainView = document.getElementById('mainView');
  if (!mainView) {
    return 0;
  }
  const computedStyle = window.getComputedStyle(mainView, null);
  const height = px2Int(computedStyle.getPropertyValue('height'));
  return height - px2Int(computedStyle.getPropertyValue('padding-top')) - px2Int(computedStyle.getPropertyValue('padding-bottom'));
}

export function getStrRealLen(str, isByte, byteLen) {
  str = str || '';
  const l = str.length;
  let blen = 0;
  let rlen = 0;
  for (let i = 0; i < l; i++) {
    if ((str.charCodeAt(i) & 0xff00) != 0) {
      blen++;
    }
    blen++;
    if (isByte && blen < byteLen) rlen++;
  }
  return isByte ? rlen : blen;
}

export function nextTick(cb) {
  return setTimeout(cb, 0);
}

export function notify(type, desc, dur = 3) {
  const messageName = { success: '成功', error: '错误', info: '提示', warning: '警告' };
  return notification[type]({
    message: messageName[type],
    description: desc,
    duration: dur,
  });
}

export const regRules = {
  mobile: { pattern: /^(1[3|4|5|7|8])\d{9}$/, message: '请输入正确手机号码' },
  header: { pattern: /^[a-zA-Z0-9]/, message: '必须以字母或数字开头' },
  commonStr: { pattern: /^[a-zA-Z0-9_]*$/, message: '仅允许由字符、数字或下划线组成' },
  port: { pattern: /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])(-([1-9]\d{0,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))?$/, message: '请填写正确的端口号' },
  ip: { pattern: /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/, message: '请填写正确ip' },
  noSpace: { pattern: /^[^ \f\r\t\v]*$/, message: '不要以空格开头' },
};

export const commonRules = [
  regRules.noSpace,
];

export const envDefault = [{ envType: 'PRO' }, { envType: 'PRE' }, { envType: 'DEV' }, { envType: 'TEST' }];

export const compTab = {
  info: [
    { title: '个人信息', name: 'person' },
    { title: '企业信息', name: 'org' },
  ],
};

export function dateFormat(date, format) {
  let fmt = format;
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  };
  return fmt;
};

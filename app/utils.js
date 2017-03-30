import path from 'path-browserify';

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
    profiles.forEach(p => {
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

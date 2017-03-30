import { notification } from 'antd';
import { getMessage } from 'messages';


let fetchCache = {};
const CACHED_FETCH_TYPE = '@@CACHED_FETCH';

const buildKey = (actionType, key) => {
  return key ? `${actionType}/${key}` : actionType;
};

export const promiseFSA = data => {
  if (data.error) {
    return Promise.reject(data.payload);
  }
  return Promise.resolve(data.payload);
};

export const actionTypeCreatorWithNameSpace = _.curry((namespace, type) => `${namespace}#${type}`);
export const invalidateCache = (actionCreator, key) => {
  if (actionCreator === undefined) {
    fetchCache = {};
  }
  const type = actionCreator.type;
  const cacheKey = buildKey(type, key);
  fetchCache = _.omit(fetchCache, [cacheKey]);
};
export const getFetchStatusObj = (state, actionCreator) => {
  return state.fetchStatus[actionCreator.type] || {};
};
export const getFetchStatus = (state, actionCreator, key) => {
  const type = actionCreator.type;
  const status = state.fetchStatus[type];
  if (key === undefined) {
    return !!status;
  }
  return !!(status || {})[key];
};
export const getMergedFetchStatus = (state, actions) => {
  return actions.some(action => {
    const actionWithKey = (action.action && action.key) ? action : { action };
    return getFetchStatus(state, actionWithKey.action, actionWithKey.key);
  });
};

export const createAction = (type, payloadHandler = (data) => data, metaCreator) => {
  const action = (...args) => {
    let meta;
    if (metaCreator === undefined) {
      meta = undefined;
    } else {
      meta = _.isFunction(metaCreator) ? metaCreator(...args) : metaCreator;
    }
    // 如果需要 cache ，就判断一下
    if (meta && meta.fetch && meta.fetch.cache) {
      const { key } = meta.fetch.cache;
      const cacheKey = buildKey(type, key);
      if (fetchCache[cacheKey]) {
        console.log(`cached action, ignore. actionType: ${type}`);
        return { type: CACHED_FETCH_TYPE, payload: { type, meta } };
      }
    }
    return {
      type,
      payload: payloadHandler(...args),
      meta,
    };
  };

  action.type = type;
  return action;
};

export const fetchStart = createAction('@@FETCH_START');
export const fetchEnd = createAction('@@FETCH_END');

export const fetchMiddleware = ({ dispatch }) => next => action => {
  // 处理下 error
  if (!!action.error) {
    // 未设置忽略错误则把错误显示一下
    if (action.meta === undefined || action.meta.ignoreError !== true) {
      // 401 不在这里处理（有点 magic 了，不太好）
      if (action.payload.status === 403) {
        notification.error({
          message: '发生错误',
          description: '没有权限',
        });
        return;
      }
      if (!_.isEmpty(action.payload) && action.payload.status !== 401) {
        const errorMessage = action.payload.message;
        notification.error({
          message: '发生错误',
          description: getMessage(errorMessage),
        });
      }
    }
  }

  // 如果是 fetch 的请求
  if (action.meta && action.meta.fetch) {
    const actionType = action.type;
    const fetch = action.meta.fetch;
    // 这是第二次回来
    if (action.meta._I_AM_BACK) {
      // dispatch fetch 结束的事件
      if (fetch.processing) {
        dispatch(fetchEnd({ type: actionType, key: fetch.processingKey }));
      }
      // 如果设置了 cache 标记但出错了，清除 cache
      if (!!action.error && fetch.cache) {
        const cacheProps = fetch.cache === true ? {} : fetch.cache;
        const { key } = cacheProps;
        const cacheKey = buildKey(actionType, key);
        fetchCache = _.omit(fetchCache, [cacheKey]);
      }
    } else { // 第一次进
      // 不在 middleware 里判断是不是有 cache ，因为在进到 middleware 里之前，action 中的 fetch 部分已经执行过了，进来的是执行后的 Promise 对象
      // dispatch fetch 开始的事件
      if (fetch.processing) {
        dispatch(fetchStart({ type: actionType, key: fetch.processingKey }));
      }
      // 设置 cache
      // 之所以在这里就设置，是为了挡住在当前 promise 完成前发起的请求
      if (fetch.cache) {
        const cacheProps = fetch.cache === true ? {} : fetch.cache;
        const { timeout, key } = cacheProps;
        const cacheKey = buildKey(actionType, key);
        fetchCache[cacheKey] = true;
        if (timeout && timeout > 0) {
          setTimeout(() => {
            fetchCache = _.omit(fetchCache, [cacheKey]);
          }, timeout);
        }
      }
      // 埋一个标记，第二次回来的时候识别
      return next({
        ...action,
        meta: {
          ...action.meta,
          _I_AM_BACK: true,
        },
      });
    }
  }
  return next(action);
};

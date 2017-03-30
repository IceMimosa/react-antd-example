import { fetchStart, fetchEnd } from 'common/utils/action';
import { createReducer } from 'common/utils/reducer';
import { getLog, clearLog, changeEnv, changeEnvId } from '../actions';

const fetchStatus = createReducer(on => {
  on(fetchStart)
    .completed((state, action) => {
      const { type, key } = action.payload;

      if (key !== undefined) {
        const old = _.isObject(state[type]) ? state[type] : {};
        return Object.assign({}, state, {
          [type]: Object.assign({}, old, { [key]: true }),
        });
      }
      return Object.assign({}, state, { [type]: true });
    });
  on(fetchEnd)
    .completed((state, action) => {
      const { type, key } = action.payload;

      if (key !== undefined) {
        const old = _.isObject(state[type]) ? state[type] : {};
        return Object.assign({}, state, {
          [type]: _.omit(old, key),
        });
      }
      return _.omit(state, type);
    });
}, {});

export const logs = createReducer(on => {
  on(getLog)
    .completed((state, action) => {
      const { logKey, forward } = action.meta;
      const { content } = action.payload;
      const oldState = state[logKey] || {};
      const oldContent = oldState.content || '';
      const newState = {
        content: forward ? oldContent + content : content + oldContent,
      };
      return Object.assign({}, state, { [logKey]: newState });
    });
  on(clearLog)
    .completed((state, action) => {
      return _.omit(state, action.payload);
    });
}, {});

export const envType = createReducer(on => {
  on(changeEnv);
}, 'PRO');

export const envId = createReducer(on => {
  on(changeEnvId);
}, '0');


export default {
  fetchStatus,
  logs,
  envType,
  envId,
};


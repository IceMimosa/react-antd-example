import * as WebSocket from 'ws';
import { createReducer } from 'common/utils/reducer';
import LoginUser from 'login-user';
import * as UserAction from 'user/actions';

export const searchUserList = createReducer(on => {
  on(UserAction.search);
}, {});

export const loginUser = createReducer(on => {
  on(UserAction.login)
    .completed((state, action) => {
      // WebSocket.connect();
      window.location.href = '/console';      
      return new LoginUser(action.payload);
    });
  on(UserAction.logout)
    .completed((state) => {
      WebSocket.disconnect();
      // 用浏览器跳转而非 react-router ，避免部分 willUnmount 中触发的 action 导致报错，同时清空 store
      window.location.href = '/';
      return state;
    });
  on(UserAction.nativeLogout)
    .completed((state) => {
      window.yz = 11;
      WebSocket.disconnect();
      window.location.href = '/';
      return state;
    });
  on(UserAction.getLogined)
    .completed((state, action) => {
      if (_.isEmpty(action.payload)) {
        // WebSocket.disconnect();
        return {};
      }
      // WebSocket.connect();
      return new LoginUser(action.payload);
    });
  on(UserAction.refreshLogined)
    .completed((state, action) => {
      return new LoginUser(action.payload);
    });
  on(UserAction.getCurrentUserInfo)
    .completed((state, action) => {
      return new LoginUser(action.payload);
    });
}, {});

export const userById = createReducer(on => {
  on(UserAction.getUserInfo);
}, {});


import agent from 'agent';
import * as ReduxCreator from 'redux-all-creator';
import * as WebSocket from 'ws';
import LoginUser from 'login-user';

export default ReduxCreator.create({
  namespace: 'user',
  actions: {
    refreshLogined: ReduxCreator.createAction(() => {
      return agent.get('/api/users/current').then(response => response.body);
    }),
    getLogined: ReduxCreator.createAction(() => {
      return agent.get('/api/users/current').then(response => response.body);
    }),
    login: ReduxCreator.createAction((loginInfo) => {
      return agent.post('/api/users/login')
        .type('form')
        .send(loginInfo)
        .then(response => response.body);
    }),
    search: ReduxCreator.createAction((query) => {
      return agent.get('/api/users/search')
        .query(query)
        .then(response => response.body);
    }),
    logout: ReduxCreator.createAction(() => {
      return agent.post('/api/users/logout').then(true);
    }),
    nativeLogout: ReduxCreator.createAction(),
    getCurrentUserInfo: ReduxCreator.createAction(() => {
      return agent.get('/api/users/current').then(response => response.body);
    }),
    create: ReduxCreator.createAction((user) => {
      return agent.post('/api/users')
        .type('form')
        .send(user)
        .then(response => response.body);
    }),
    putProfile: ReduxCreator.createAction((userProfile) => {
      return agent.put('/api/users/current/profile')
        .type('form')
        .send(userProfile)
        .then(response => response.body);
    }),
  },
  reducers: {
    searchUserList: ReduxCreator.createReducer((on, actions) => {
      on(actions.search);
    }, {}),
    loginUser: ReduxCreator.createReducer((on, actions) => {
      on(actions.login)
        .completed((state, action) => {
          // WebSocket.connect();
          window.location.href = '/console';
          return new LoginUser(action.payload);
        });
      on(actions.logout)
        .completed((state) => {
          WebSocket.disconnect();
          // 用浏览器跳转而非 react-router ，避免部分 willUnmount 中触发的 action 导致报错，同时清空 store
          window.location.href = '/';
          return state;
        });
      on(actions.nativeLogout)
        .completed((state) => {
          window.yz = 11;
          WebSocket.disconnect();
          window.location.href = '/';
          return state;
        });
      on(actions.getLogined)
        .completed((state, action) => {
          if (_.isEmpty(action.payload)) {
            // WebSocket.disconnect();
            return {};
          }
          // WebSocket.connect();
          return new LoginUser(action.payload);
        });
      on(actions.refreshLogined)
        .completed((state, action) => {
          return new LoginUser(action.payload);
        });
      on(actions.getCurrentUserInfo)
        .completed((state, action) => {
          return new LoginUser(action.payload);
        });
    }, {}),
  },
});


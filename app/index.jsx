import * as React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import ReactDOM from 'react-dom';
import ReduxPromiseMiddleware from 'redux-promise';
import { notification } from 'antd';
import Cookie from 'js-cookie';
import { removeBeforeLoad } from 'scripts/page-leave';

import * as ReduxCreator from 'redux-all-creator';
import UserCreator from 'user/creators';

import AppRouter from './router';
import reducers from './reducers';

// import { fetchMiddleware } from 'common/utils/action';
// import * as UserAction from 'user/actions';
import { setStatusAction } from './agent';
import { init as wsHandlerInit } from './ws-handlers';


import './styles/_color.scss';
import './styles/antd-extension.scss';
import './styles/antd-own.scss';
import './styles/app.scss';
import './styles/search.scss';
import './styles/overwrite.scss';
import './styles/layout.scss';

// creator connect
const connector = ReduxCreator.connect(UserCreator);

// remove form not saved event
removeBeforeLoad();

// make React global, otherwise translated jsx will get a 'React not defined' error
window.React = React;

window._profile_ = 'terminus';

const store = Redux.createStore(
  Redux.combineReducers({ ...reducers, ...connector.getReducers() }),
  Redux.compose(
    Redux.applyMiddleware(ReduxCreator.fetchStatusMiddleware, ReduxPromiseMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);
const { Provider } = ReactRedux;

// dispatch logout action when 401 status received
let logoutHandling = false;
setStatusAction(401, () => {
  if (logoutHandling) return;
  logoutHandling = true;
  Cookie.set('lastPath', window.location.pathname + window.location.search);
  notification.warning({
    message: '未登录',
    description: '未登录，可能是用户信息已超时，请重新登录',
  });
  setTimeout(() => {
    store.dispatch(UserCreator.nativeLogout());
    logoutHandling = false;
  }, 1000);
});
// init all ws handlers
wsHandlerInit(store.dispatch);

store.dispatch(UserCreator.getLogined())
  .then(() => {
    ReactDOM.render((
      <Provider store={store}>
        <AppRouter/>
      </Provider>
    ), document.getElementById('content'));
  });

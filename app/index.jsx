import * as React from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import ReactDOM from 'react-dom';
import ReduxPromiseMiddleware from 'redux-promise';
import { notification } from 'antd';
import Cookie from 'js-cookie';

import AppRouter from './router';
import reducers from './reducers';

import { fetchMiddleware } from 'common/utils/action';
import * as UserAction from 'user/actions';
import { setStatusAction } from './agent';
import { init as wsHandlerInit } from './ws-handlers';
import { removeBeforeLoad } from 'scripts/page-leave';

import './styles/_color.scss';
import './styles/antd-extension.scss';
import './styles/antd-own.scss';
import './styles/app.scss';
import './styles/search.scss';
import './styles/overwrite.scss';
import './styles/layout.scss';

// remove form not saved event
removeBeforeLoad();

// make React global, otherwise translated jsx will get a 'React not defined' error
window.React = React;

window._profile_ = 'terminus';

const store = Redux.createStore(reducers, Redux.compose(
  Redux.applyMiddleware(fetchMiddleware, ReduxPromiseMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));
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
    store.dispatch(UserAction.nativeLogout());
    logoutHandling = false;
  }, 1000);
});
// init all ws handlers
wsHandlerInit(store.dispatch);

store.dispatch(UserAction.getLogined())
  .then(() => {
    ReactDOM.render((
      <Provider store={store}>
        <AppRouter/>
      </Provider>
    ), document.getElementById('content'));
  });

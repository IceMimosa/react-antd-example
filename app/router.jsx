import * as ReactRedux from 'react-redux';
import * as React from 'react';
import { Router, browserHistory } from 'react-router';
import Cookie from 'js-cookie';

import LoginPage from 'index/pages/login';
import OfficialContainer from 'index/pages/official';
import PageContainer from 'index/pages/page-container';
import Register from 'user/pages/register-account';

import getUserRouter from 'user';

import { wrapRoutes } from 'common/utils/route';

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.loginUser = props.loginUser;
    this.initRoutes();
  }
  componentWillReceiveProps(nextProps) {
    this.loginUser = nextProps.loginUser;
  }
  shouldComponentUpdate() {
    // 不需要重新渲染，如果触发重新渲染 react-router 有时候会报个 warning
    return false
  }

  onConsoleEnter(nextState, replace) {
    // redirect to index if not login
    if (_.isEmpty(this.loginUser)) {
      replace({
        pathname: '/',
      });
    }
  }

  // console index redirect by user type
  onConsoleIndexEnter(nextState, replace) {
    const pathname = Cookie.get('lastPath');
    // 可以根据用户相关权限, 跳转到不用页面, 这里默认跳转到 users 模块
    replace({
      pathname: pathname || '/console/users',
    });
    Cookie.remove('lastPath');
  }

  // check an route's auth
  onEnterAuthCheck(userType, nextState, replace) {
    // 如果没有权限, 可以跳转到 `/console`
    // ......
  }

  // example: enter auth check  
  onSystemAdminEnter(nextState, replace) {
    this.onEnterAuthCheck('SYS_ADMIN', nextState, replace);
  }

  initChildRoutes() {
    const routeHandlers = [
      getUserRouter,
    ];
    const childRoutes = [];
    routeHandlers.forEach(handler => _.forEach(this::handler(), route => childRoutes.push(route)));
    return childRoutes;
  }

  initRoutes() {
    this.routes = {
      path: '/',
      indexRoute: { component: LoginPage },
      childRoutes: [
        { path: 'console',
          component: PageContainer,
          onEnter: ::this.onConsoleEnter,
          indexRoute: {
            onEnter: ::this.onConsoleIndexEnter,
          },
          childRoutes: ::this.initChildRoutes(),
        },
        {
          path: 'register',
          component: OfficialContainer,
          childRoutes: [
            {
              path: 'developer',
              component: Register,
            },
            {
              path: 'org',
              component: Register,
            },
          ],
        },
      ],
    };
    wrapRoutes(this.routes.childRoutes);  // 包装routes，在getComponent方法中添加route.component
  }

  render() {
    return <Router history={browserHistory} routes={this.routes}/>;
  }
}

const mapStateToProps = (state) => {
  return {
    loginUser: state.loginUser,
  };
};

export default ReactRedux.connect(mapStateToProps, null)(AppRouter);

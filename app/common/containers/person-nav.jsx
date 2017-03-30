import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';

import Cookie from 'js-cookie';
import PersonNav from '../components/person-nav';

const mapStateToProps = (state) => {
  return {
    loginUser: state.loginUser,
    notify: state.notify,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout() {
      dispatch(UserAction.logout());
    },
    onUserTypeSwitch(type) {
      Cookie.set('userType', type);
      window.location.href = '/console';
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PersonNav);

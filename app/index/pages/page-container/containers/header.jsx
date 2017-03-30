import * as ReactRedux from 'react-redux';
import { browserHistory } from 'react-router';
import * as UserAction from 'user/actions';
import Cookie from 'js-cookie';
import Header from '../components/header';


const mapStateToProps = (state) => {
  return {
    user: state.loginUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout() {
      return dispatch(UserAction.logout());
    },
    onProfile() {
      browserHistory.push('/profile');
    },
    onUserTypeSwitch(type) {
      Cookie.set('userType', type);
      window.location.href = '/console';
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Header);

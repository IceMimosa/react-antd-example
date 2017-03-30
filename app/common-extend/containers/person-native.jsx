import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import Cookie from 'js-cookie';
import PersonNative from '../components/person-native';

const mapStateToProps = (state) => {
  return {
    loginUser: state.loginUser,
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

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PersonNative);

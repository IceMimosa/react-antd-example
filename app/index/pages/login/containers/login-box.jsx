import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import PureLoginBox from '../components/login-box';

const mapStateToProps = (state) => {
  return {
    loginUser: state.loginUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSubmit(params) {
      dispatch(UserAction.login(params));
    },
    onLogout() {
      dispatch(UserAction.logout());
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PureLoginBox);

import * as ReactRedux from 'react-redux';
// import * as UserAction from 'user/actions';
import UserCreator from 'user/creators';
import PureLoginBox from '../components/login-box';

const mapStateToProps = (state) => {
  return {
    loginUser: state.loginUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSubmit(params) {
      dispatch(UserCreator.login(params));
    },
    onLogout() {
      dispatch(UserCreator.logout());
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PureLoginBox);

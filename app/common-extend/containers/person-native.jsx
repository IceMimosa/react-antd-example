import * as ReactRedux from 'react-redux';
// import * as UserAction from 'user/actions';
import UserCreator from 'user/creators';
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
      dispatch(UserCreator.logout());
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PersonNative);

import * as ReactRedux from 'react-redux';
import { browserHistory } from 'react-router';
// import * as UserAction from 'user/actions';
import UserCreator from 'user/creators';
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
      return dispatch(UserCreator.logout());
    },
    onProfile() {
      browserHistory.push('/profile');
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Header);

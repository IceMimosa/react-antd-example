import * as ReactRedux from 'react-redux';
// import * as UserAction from 'user/actions';
import UserCreator from 'user/creators';
import PureUserSettingBasic from '../components/user-setting-basic';

const mapStateToProps = (state) => {
  return {
    userProfile: state.loginUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateProfile(userProfile) {
      return dispatch(UserCreator.putProfile(userProfile))
        .then(() => dispatch(UserCreator.getCurrentUserInfo()));
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PureUserSettingBasic);

import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import PureUserSettingbasic from '../components/user-setting-basic';

const mapStateToProps = state => {
  return {
    userProfile: state.loginUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdataProfile(userProfile) {
      return dispatch(UserAction.putProfile(userProfile))
        .then(() => dispatch(UserAction.getCurrentUserInfo()));
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PureUserSettingbasic);

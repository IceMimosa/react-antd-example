import * as ReactRedux from 'react-redux';
import { promiseFSA } from 'common/utils/action';
import * as UserAction from 'user/actions';
import PureUserSettingOpenAPI from '../components/user-setting-openAPI';

const mapStateToProps = state => {
  return {
    userProfile: state.loginUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    turnOnOpenAPI() {
      return dispatch(UserAction.turnOnOpenAPI())
        .then(promiseFSA)
        .then(() => dispatch(UserAction.refreshLogined()));
    },
    turnOffOpenAPI() {
      return dispatch(UserAction.turnOffOpenAPI())
        .then(promiseFSA)
        .then(() => dispatch(UserAction.refreshLogined()));
    },
    refreshOpenToken() {
      return dispatch(UserAction.turnOnOpenAPI())
        .then(promiseFSA)
        .then(() => dispatch(UserAction.refreshLogined()));
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PureUserSettingOpenAPI);

import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import { promiseFSA } from 'common/utils/action';
import PureUserSettingOrg from '../components/user-setting-org';

const mapStateToProps = state => {
  return {
    userProfile: state.loginUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    applyOrg(orgId) {
      return dispatch(UserAction.orgApply(orgId))
        .then(promiseFSA)
        .then(() => dispatch(UserAction.refreshLogined()));
    },
    cancelOrgApply(orgId) {
      return dispatch(UserAction.orgApplyCancel(orgId))
        .then(promiseFSA)
        .then(() => dispatch(UserAction.refreshLogined()));
    },
    onLeaveOrg(orgId) {
      return dispatch(UserAction.orgLeave(orgId))
        .then(promiseFSA)
        .then(() => dispatch(UserAction.refreshLogined()));
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PureUserSettingOrg);

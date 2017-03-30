import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import { promiseFSA } from 'common/utils/action';
import PrueChangePasswordModal from '../../components/user-change/password-modal';

const mapStateToProps = () => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangePassword: (data) => {
      return dispatch(UserAction.changePassword(data))
                .then(promiseFSA);
    },
    onGetCurrentUserInfo() {
      dispatch(UserAction.getCurrentUserInfo());
    },
    onLogout: () => {
      return dispatch(UserAction.logout());
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(PrueChangePasswordModal);

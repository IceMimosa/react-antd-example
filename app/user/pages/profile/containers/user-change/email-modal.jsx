import * as ReactRedux from 'react-redux';
import { promiseFSA } from 'common/utils/action';
import * as UserAction from 'user/actions';
import PrueChangeEmailModal from '../../components/user-change/email-modal';

const mapStateToProps = () => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeEmail: (data) => {
      return dispatch(UserAction.updateEmail(data))
                .then(promiseFSA);
    },
    onGetCurrentUserInfo() {
      dispatch(UserAction.getCurrentUserInfo());
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(PrueChangeEmailModal);

import * as ReactRedux from 'react-redux';
import { promiseFSA } from 'common/utils/action';
import * as UserAction from 'user/actions';
import PrueChangePhoneModal from '../../components/user-change/phone-modal';

const mapStateToProps = () => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSendVerfiCode(tel) {
      return dispatch(UserAction.sendVerfiCode(tel))
                .then(promiseFSA);
    },
    onChangePhone(data) {
      return dispatch(UserAction.updatePhone(data))
                .then(promiseFSA);
    },
    onGetCurrentUserInfo() {
      dispatch(UserAction.getCurrentUserInfo());
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(PrueChangePhoneModal);

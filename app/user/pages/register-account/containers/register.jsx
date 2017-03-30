import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import { promiseFSA } from 'common/utils/action';
import PureRegister from '../components/register';

const mapStateToProps = (state, ownProps) => {
  return {
    path: ownProps.route.path,
    title: ownProps.route.path === 'developer' ? '开发者' : '企业',
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRegisterAccount(values) {
      return dispatch(UserAction.registerAccount(values));
    },
    onRegisterOrg(values) {
      return dispatch(UserAction.registerOrg(values));
    },
    onCreateOrg(values) {
      return dispatch(UserAction.createOrg(values));
    },
    onSendVerfiCode(mobile) {
      return dispatch(UserAction.sendRegisterVerfiCode(mobile))
                .then(promiseFSA);
    },
    onCurrentUserInfo() {
      dispatch(UserAction.getCurrentUserInfo());
    },
  };
};

class Register extends React.Component {
  render() {
    return (
      <PureRegister {...this.props}/>
    );
  }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Register);

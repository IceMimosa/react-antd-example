import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import PureUserSettingForm from '../components/user-setting';

const mapDispatchToProps = dispatch => {
  return {
    getProfile() {
      return dispatch(UserAction.getCurrentProfile());
    },
    onUpdataProfile(userProfile) {
      return dispatch(UserAction.putProfile(userProfile));
    },
  };
};

class UserSettingForm extends React.Component {
  render() {
    return (
      <PureUserSettingForm {...this.props}/>
    );
  }
}

export default ReactRedux.connect(null, mapDispatchToProps)(UserSettingForm);

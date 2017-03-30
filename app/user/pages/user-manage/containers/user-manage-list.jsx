import { getFetchStatus, promiseFSA } from 'common/utils/action';
import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import PureUserManageList from '../components/user-manage-list';


const mapStateToProps = (state) => {
  return {
    isFetching: getFetchStatus(state, UserAction.search),
    users: state.searchUserList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchSubmit(query) {
      return dispatch(UserAction.search(query));
    },
    onCreateUser(user) {
      return dispatch(UserAction.create(user))
        .then(promiseFSA);
    },
    onResetPassword(userId, password) {
      return dispatch(UserAction.resetPassword(userId, password));
    },
    lockUser(user) {
      return dispatch(UserAction.lockUser(user.id));
    },
    unlockUser(user) {
      return dispatch(UserAction.unlockUser(user.id));
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PureUserManageList);

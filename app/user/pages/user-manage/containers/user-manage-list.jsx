import { getFetchStatus, promiseFSA } from 'common/utils/action';
import * as ReactRedux from 'react-redux';
// import * as UserAction from 'user/actions';
import UserCreator from 'user/creators';
import PureUserManageList from '../components/user-manage-list';


const mapStateToProps = (state) => {
  return {
    isFetching: getFetchStatus(state, UserCreator.search),
    users: state.searchUserList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchSubmit(query) {
      return dispatch(UserCreator.search(query));
    },
    onCreateUser(user) {
      return dispatch(UserCreator.create(user))
        .then(promiseFSA);
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PureUserManageList);

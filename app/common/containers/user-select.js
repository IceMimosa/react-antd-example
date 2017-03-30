import * as ReactRedux from 'react-redux';
import * as UserAction from 'user/actions';
import Suggestion from '../components/suggestion';

const mapStateToProps = (state) => {
  return {
    options: state.suggestUser.map(user => {
      const text = `${user.nick}(${user.mobile})`;
      return {
        value: user.id.toString(),
        text,
      };
    }),
    placeholder: '输入手机号或昵称来查找用户',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSuggest: (value) => {
      return dispatch(UserAction.suggest(value));
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Suggestion);

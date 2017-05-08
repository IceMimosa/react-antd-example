import * as ReactRedux from 'react-redux';
import Sidebar from '../components/sidebar';

const mapStateToProps = (state) => {
  return {
    loginUser: state.loginUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Sidebar);

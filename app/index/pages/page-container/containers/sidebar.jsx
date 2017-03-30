import * as ReactRedux from 'react-redux';
import Sidebar from '../components/sidebar';

const mapStateToProps = (state) => {
  return {
    loginUser: state.loginUser,
    reloadFileList: state.reloadFileList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onReloadFileList(i) {
      
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Sidebar);

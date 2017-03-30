import * as ReactRedux from 'react-redux';
import PureFileChooseModal from '../components/modal';
import * as FileAction from '../actions';

const mapStateToProps = (state) => {
  return {
    ...state.folderTree,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFolderList(path, type, suffixs) {
      return dispatch(FileAction.folderList(path, type, suffixs));
    },
    onMoveFile(sources, dest) {
      return dispatch(FileAction.moveFile(sources, dest));
    },
    onInit(children) {
      dispatch(FileAction.initTree(children));
    },
    onEmpty() {
      dispatch(FileAction.emptyTree());
    },
    onAdd(tree, eventKey, children) {
      dispatch(FileAction.addTree(tree, eventKey, children));
    },
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(PureFileChooseModal);

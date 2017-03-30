import * as ReactRedux from 'react-redux';
import PureFileChooseModal from '../components/modal-copy';
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
    onCopyFile(sources, dest, override) {
      return dispatch(FileAction.copyFile(sources, dest, override));
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

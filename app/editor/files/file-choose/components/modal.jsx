import * as React from 'react';
import { Icon } from 'common';
import { Modal, Form, Tree, message } from 'antd';
import './modal.scss';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

const loop = (tree) => {
  const data = tree.map((item) => {
    const name = <span className='file-name'><Icon type={item.fileType === 1 ? 'open-copy' : 'file'}/>{item.name}</span>;
    if (item.fileType !== 1) {
      return <TreeNode title={name} key={item.key} isLeaf/>;
    } else if (item.children && item.children.length > 0) {
      return <TreeNode title={name} key={item.key}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode title={name} key={item.key} isLeaf={item.isLeaf}/>;
  });
  return data;
};

class ChooseForm extends React.Component {
  constructor(props) {
    super(props);
    this.after = '';
    this.nodeSelect = this.nodeSelect.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  nodeSelect(info) {
    const { setFieldsValue } = this.props.form;
    if (this.checkFileTypeSupport(info[0])) {
      setFieldsValue({ folder: info[0].substring(0, info[0].length - 2) });
    } else {
      setFieldsValue({ folder: '' });
    }
  }

  checkFileTypeSupport(filePath) {
    let flag = false;
    const { mode = 'move' } = this.props;
    if (mode === 'move') {
      return true;
    }
    const last = filePath.split('-');
    const fileType = last[last.length - 1];
    if (fileType === '2') {
      flag = true;
      this.after = '-2';
    }
    return flag;
  }

  loadData(treeNode) {
    const { eventKey } = treeNode.props;
    const { onFolderList, searchType, suffixs, onAdd, tree } = this.props;
    return onFolderList(eventKey, searchType, suffixs).then(({ payload }) => {
      const children = payload.map(({ currentDir, name, file }) => {
        const fileType = file ? 2 : 1;
        const path = `${currentDir === '/' ? '' : currentDir}/${name}`;
        let after = '';
        if (file) {
          after = '-2';
        }
        return { key: `${path}${after}`, fileType, name: `${name}` };
      });
      onAdd(tree, eventKey, children);
    });
  }

  render() {
    const { suffixs, mode = 'move', modalKey } = this.props;
    const msg = mode === 'move' ? '请选择移动的位置' : `请选择文件,文件格式为${suffixs.toString()}`;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const treeNodes = loop(this.props.tree);
    const selectedKeys = [getFieldValue('folder') + this.after];
    return (
      <FormItem>
        {getFieldDecorator('folder', {
          rules: [{ required: true, message: msg }],
        })(
          <div className='folder-content'>
            <Tree
              key={modalKey}
              onSelect={this.nodeSelect}
              loadData={this.loadData}
              defaultExpandedKeys={['/']}
              selectedKeys={selectedKeys}
            >
              {treeNodes}
            </Tree>
          </div>
        )}
      </FormItem>
    );
  }
}

ChooseForm = Form.create({})(ChooseForm);

class FileChooseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.cancle = this.cancle.bind(this);
    this.confirm = this.confirm.bind(this);
    this.pathConfirm = this.pathConfirm.bind(this);
  }

  show(content = {}) {
    const { suffixs } = content;
    const { onFolderList, searchType, onInit } = this.props;
    onFolderList('/', searchType, suffixs).then(({ payload }) => {
      const children = payload.map(({ currentDir, name, file }) => {
        const fileType = file ? 2 : 1;
        const path = `${currentDir === '/' ? '' : currentDir}/${name}`;
        let after = '';
        if (file) {
          after = '-2';
        }
        return { key: `${path}${after}`, fileType, name: `${name}` };
      });
      onInit(children);
    });
    this.setState({ visible: true, modalKey: Date.now() });
  }

  cancle() {
    this.props.onEmpty();
    this.chooseForm.resetFields();
    this.setState({ visible: false });
  }

  moveFile(sources, dest) {
    const { onMoveFile, onReload, path } = this.props;
    onMoveFile(sources, dest).then(({ payload }) => {
      if (payload === true) {
        onReload(path, 1, '');
        this.cancle();
      }
    });
  }

  confirm() {
    const { mode = 'move', title } = this.props;
    this.chooseForm.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      if (title === '选择路径' || mode === 'file') {
        this.pathConfirm(values.folder);
      } else if (mode === 'move') {
        this.moveConfirm(values.folder);
      }
    });
  }

  // 选择路径
  pathConfirm(path) {
    const { pathConfirm } = this.props;
    if (pathConfirm) {
      pathConfirm(path);
    }
    this.cancle();
  }

  moveConfirm(folder) {
    const { selected, path } = this.props;
    const current = path[path.length - 1] === '/' ? path : `${path}/`;
    const sources = selected.map((single) => {
      return current + single.name;
    });
    let isSelf = false;
    _.map(sources, (name) => {
      if (name === folder) {
        message.warning('文件不能移动给自己');
        isSelf = true;
      } else {
        name = name.substr(0, _.lastIndexOf(name, '/')) || '/';
        if (name === folder) {
          message.warning('文件不能移动到自己所在文件夹');
          isSelf = true;
        }
      }
    });
    if (!isSelf) {
      confirm({
        title: '继续操作',
        content: <span>若存在同名文件, 同名文件将会被覆盖, 是否继续?</span>,
        onOk: () => {
          this.moveFile(sources, folder);
        },
      });
    }
  }

  render() {
    const { mode = 'move', title } = this.props;
    const { modalKey } = this.state;
    let titles;
    if (title === '选择路径') {
      titles = '选择路径';
    } else {
      titles = mode === 'move' ? '移动文件' : '选择文件';
    }
    return (
      <Modal
        title={titles}
        className='wrap-folder'
        visible={this.state.visible}
        onCancel={this.cancle}
        onOk={this.confirm}
      >
        <ChooseForm ref={(chooseForm) => { this.chooseForm = chooseForm; }} modalKey={modalKey} {...this.state} {...this.props}/>
      </Modal>
    );
  }
}

module.exports = FileChooseModal;

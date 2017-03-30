import { Modal, Form, Tree } from 'antd';
import { Icon } from 'common';
import * as React from 'react';
import './modal.scss';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

const loop = (tree) => {
  const data = tree.map((item) => {
    const name = <span className='file-name'><Icon type={item.fileType === 1 ? 'open-copy' : 'file'}/>{item.name}</span>
    if (item.fileType !== 1) {
      return <TreeNode title={name} key={item.key} isLeaf={true}/>;
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
    this.nodeSelect = this.nodeSelect.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  nodeSelect(info) {
    const { setFieldsValue } = this.props.form;
    if (this.checkFileTypeSupport(info[0])) {
      setFieldsValue({ folder: info[0] });
    } else {
      setFieldsValue({ folder: '' });
    }
  }

  checkFileTypeSupport(filePath) {
    let flag = false;
    const { suffixs, mode = 'move' } = this.props;
    if (mode === 'move') {
      return true;
    }
    const last = filePath.split('.');
    const suff = last[last.length - 1];
    suffixs.forEach((single) => {
      if (single === suff) {
        flag = true;
      }
    });
    return flag;
  }

  loadData(treeNode) {
    const { eventKey } = treeNode.props;
    const { onFolderList, searchType, suffixs, onAdd, tree } = this.props;
    return onFolderList(eventKey, searchType, suffixs).then(({ payload }) => {
      const children = payload.map((single) => {
        return {key: `${single.currentDir}/${single.name}`, fileType: single.type, name: single.name };
      });
      onAdd(tree, eventKey, children);
    });
  }

  render() {
    const { suffixs, mode = 'move' } = this.props;
    const msg = mode === 'move' ? '请选择移动的位置' : '请选择文件,文件格式为' + suffixs.toString();
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const treeNodes = loop(this.props.tree);
    const selectedKeys = [getFieldValue('folder')];
    return (
      <FormItem>
        {getFieldDecorator('folder', {
          rules: [{ required: true, message: msg }],
        })(
          <div className='folder-content'>
            <Tree onSelect={this.nodeSelect}
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

class FileCopyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.cancle = this.cancle.bind(this);
    this.confirm = this.confirm.bind(this);
    this.fileConfirm = this.fileConfirm.bind(this);
  }

  show(content = {}) {
    const { suffixs } = content;
    const { onFolderList, searchType, onInit } = this.props;
    onFolderList('/', searchType, suffixs).then(({ payload }) => {
      const children = payload.map((single) => {
        return { name: single.name, fileType: single.type, key: single.currentDir + single.name };
      });
      onInit(children);
    });
    this.setState({ visible: true });
  }

  cancle() {
    this.props.onEmpty();
    this.refs.chooseForm.resetFields();
    this.setState({ visible: false });
  }

  copyFile(sources, dest, override) {
    const { onCopyFile, onReload, path } = this.props;
    onCopyFile(sources, dest, override).then(({ payload }) => {
      if (payload === true) {
        onReload(path, 1, '');
        ::this.cancle();
      }
    });
  }

  confirm() {
    const { mode = 'move' } = this.props;
    const { chooseForm } = this.refs;
    chooseForm.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      if (mode === 'file') {
        this.fileConfirm(values.folder);
      } else if (mode === 'move') {
        this.moveConfirm(values.folder);
      }
    });
  }

  fileConfirm(filePath) {
    const { fileConfirm } = this.props;
    if (fileConfirm) {
      fileConfirm(filePath);
      this.cancle();
    }
  }

  moveConfirm(folder) {
    const { selected, path } = this.props;
    let override = true;
    const current = path[path.length - 1] === '/' ? path : `${path}/`;
    const sources = selected.map((single) => {
      return current + single.name;
    });
    confirm({
      title: '继续操作',
      content: <span>若存在同名文件, 是否覆盖同名文件?</span>,
      okText: '是',
      cancelText: '否，创建副本文件',
      onOk: () => {
        this.copyFile(sources, folder, override);
      },
      onCancel: () => {
        override = false;
        this.copyFile(sources, folder, override);
      },
    });
  }

  render() {
    const { mode = 'move', modalTitle = '' } = this.props;
    let title = mode == 'move' ? '移动文件' : '选择文件';
    if (modalTitle !== '') {
      title = modalTitle;
    }
    return (
      <Modal title={title}
        className='wrap-folder'
        visible={this.state.visible}
        onCancel={this.cancle}
        onOk={this.confirm}>
        <ChooseForm ref='chooseForm' {...this.state} {...this.props}/>
      </Modal>
    );
  }
}

module.exports = FileCopyModal;

import * as React from 'react';
import ReactDOM from 'react-dom';
import { Button, Col, message } from 'antd';
import { Icon } from 'common';
import { generateUUID, clickable } from 'scripts';
import FileChooseModal from 'editor/files/file-choose/containers/modal';
import { baseEdgeStyle, nodesList, boxNameTypes } from './config';
import { checkRule, getRightPosition, getRightMenuPos } from './dynamic';
import './dynamic-nodes.scss';
import './vis-overwrite.scss';
import NodeModal from './node-modal';
import ContextMenu from './context-menu';

class DynamicNodes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suffixs: '',
      type: '',
    };
    this.draw = this.draw.bind(this);
    this.editNode = this.editNode.bind(this);
    this.nodeClick = this.nodeClick.bind(this);
    this.backClick = this.backClick.bind(this);
    this.operateClick = this.operateClick.bind(this);
    this.openFileChooseModal = this.openFileChooseModal.bind(this);
    this.pathConfirm = this.pathConfirm.bind(this);
    this.searchDb = this.searchDb.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.addEdge = this.addEdge.bind(this);
    this.setNodesPosition = this.setNodesPosition.bind(this);
    this.hoverNode = this.hoverNode.bind(this);
    this.clickNode = this.clickNode.bind(this);
    this.openContextMenu = this.openContextMenu.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);

    const uuid = generateUUID().replace(/\-/g, '');
    this.compId = `node${uuid}`;
    this.menuId = `menu${uuid}`;
    this.network = null;
    this.boxType = '';
    this.idsNumber = {};
    this.hoverTime = 0;
    this.munuList = [{
      name: '编辑',
      onClick: () => this.operateClick('edit', 'vis-edit'),
    }, {
      name: '连线',
      onClick: () => this.operateClick('line', 'vis-connect'),
    }, {
      name: '删除',
      onClick: () => this.operateClick('edit', 'vis-delete'),
    }];
  }

  componentDidMount() {
    require.ensure(['vis-network'], (require) => {
      require('vis-network');
      this.draw();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.munuList && nextProps.munuList.length > 0) {
      this.munuList = nextProps.munuList;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this, false);
    document.querySelector('.main').removeEventListener('scroll', this, false);
  }

  getNetWork() {
    return this.network;
  }

  setNodesPosition() {
    const { nodes, edges } = this.network.body.data;
    this.draw({ edges, nodes: getRightPosition(nodes, edges) });
  }

  addEdge(data, callback) {
    const { nodeMap } = this.props;
    const { edges } = this.network.body;
    data = { ...data, ...baseEdgeStyle };
    if (data.from !== data.to && checkRule(nodeMap, edges, data)) {
      callback(data);
    }
  }

  editNode(data, callback) {
    const { uuid, nodeMap } = this.props;
    const { label, ...other } = data;
    if (typeof (other.id) !== 'number') {
      this.idsNumber[uuid] = other.id;
      other.id = uuid;
    }
    const array = label.split('\n');
    const name = array[0];
    const content = nodeMap.get(`${other.id}`) ? nodeMap.getIn([`${other.id}`, 'content']) : null;
    if (array[1]) {
      this.boxType = boxNameTypes[array[1]];
    }
    this.nodeModal.show({ type: this.boxType, name, other, content }, callback, this.boxType);
  }

  deleteNode(data, callback) {
    const { uuid, nodeMap, onNodeDelete } = this.props;
    const { nodes } = data;
    onNodeDelete(nodeMap, uuid, nodes[0]);
    callback(data);
  }

  draw(data = {}) {
    if (!window.Network) {
      require.ensure(['vis-network'], (require) => {
        require('vis-network');
        this.draw(data);
      });
      return null;
    }

    this.destroy();
    const { readOnly } = this.props;
    const options = {
      layout: {
        randomSeed: 2,
      },
      physics: {
        enabled: false,
      },
      locale: 'cn',
      interaction: {
        navigationButtons: true,
        // keyboard: true,
        hover: !readOnly,
      },
      manipulation: {
        addNode: this.editNode,
        editNode: this.editNode,
        addEdge: this.addEdge,
        deleteNode: this.deleteNode,
      },
    };
    this.network = new Network(this.networkRef, data, options);
    this.network.on('oncontext', this.openContextMenu);
    this.network.on('hoverNode', this.hoverNode);
    this.network.on('selectNode', this.clickNode);
    return null;
  }

  hoverNode() {
    if (this.hoverTime < 3) {
      message.warning('通过点击选中节点，才能操作菜单');
      this.hoverTime += 1;
    }
  }

  clickNode({ nodes }) {
    const { onClick } = this.props;
    if (onClick) onClick(nodes);
  }

  openContextMenu(params) {
    const { nodes, pointer } = params;
    const { x, y } = pointer.DOM;
    const $network = document.getElementById(`${this.compId}`);

    if (this.target) {
      $network.removeChild(this.target);
      this.target = null;
    }
    event.preventDefault();
    if (nodes.length !== 1) {
      return;
    }

    this.target = document.createElement('div');
    $network.appendChild(this.target);
    const style = getRightMenuPos(x, y, $network);
    ReactDOM.render(<ContextMenu style={style} id={this.menuId} munuList={this.munuList}/>, this.target);

    document.addEventListener('click', this.hideContextMenu);
  }

  hideContextMenu() {
    if (this.target) {
      const $dynodes = document.getElementById(`${this.compId}`);
      if ($dynodes) $dynodes.removeChild(this.target);
      this.target = null;
    }
    document.removeEventListener('click', this, false);
  }

  nodeClick(type) {
    this.boxType = type;
    this.setState({ type });
    this.backClick();
    clickable(document.querySelector(`#${this.compId} .vis-add`));
  }

  operateClick(type, domClass) {
    this.boxType = '';
    this.setState({ type });
    this.backClick();
    clickable(document.querySelector(`#${this.compId} .${domClass}`));
    if (domClass === 'vis-zoomExtends') {
      this.setNodesPosition();
    }
  }

  backClick() {
    clickable(document.querySelector(`#${this.compId} .vis-back`));
  }

  searchDb(db, refresh) {
    const { onGetTables, onEmptyTables } = this.props;
    onEmptyTables();
    onGetTables(db, refresh).then(({ payload }) => {
      const sourceArray = ['dbName', 'type', 'host', 'port', 'url', 'dataBase', 'dbUserName', 'dbUserPassword'];
      const nodeType = 'Sqoop';
      const { dataSource } = payload;
      const fieldsValue = {};
      sourceArray.forEach((field) => {
        fieldsValue[field + nodeType] = dataSource[field];
      });
      this.nodeModal.setFormValue(fieldsValue);
    });
  }

  openFileChooseModal(key, suffixs = '') {
    this.key = key;
    if (suffixs === 'path') {
      this.filePath.refs.wrappedInstance.show();
    } else {
      this.setState({ suffixs });
      this.fileChoose.refs.wrappedInstance.show({ suffixs });
    }
  }

  pathConfirm(filePath) {
    const content = {};
    content[this.key] = filePath;
    this.nodeModal.setFormValue(content);
  }

  destroy() {
    if (this.network !== null) {
      this.network.destroy();
      this.network = null;
    }
  }

  render() {
    const { suffixs = '', type } = this.state;
    const { readOnly, networkHeight } = this.props;
    return (
      <div className='dynamic-nodes'>
        <Col span='20' className={readOnly ? 'hide' : 'node-show'}>
          {nodesList.map((node) => {
            return <Button type='ghost' className={type === node.type ? 'active' : ''} key={node.id} onClick={() => this.nodeClick(node.type)}><img src={node.img} alt=''/>{node.name}</Button>
          })}
        </Col>
        <Col span='4' className='node-operate'>
          {/*<Icon type='lianxian' className={type === 'line' ? 'active' : ''} onClick={() => this.operateClick('line', 'vis-connect')}/>
          <Icon type='bianji-1' className={type === 'edit' ? 'active' : ''} onClick={() => this.operateClick('edit', 'vis-edit')}/>
          <Icon type='shanchu' className={type === 'del' ? 'active' : ''} onClick={() => this.operateClick('edit', 'vis-delete')}/>*/}
          <Icon type='huanyuan' className={type === 'restore' ? 'active' : ''} onClick={() => this.operateClick('restore', 'vis-zoomExtends')}/>
          <Icon type='fangda' className={type === 'bigger' ? 'active' : ''} onClick={() => this.operateClick('bigger', 'vis-zoomIn')}/>
          <Icon type='suoxiao' className={type === 'smaller' ? 'active' : ''} onClick={() => this.operateClick('smaller', 'vis-zoomOut')}/>
        </Col>
        <div ref={(networkRef) => { this.networkRef = networkRef; }} className='network' style={{ height: networkHeight }} id={this.compId}></div>
        <NodeModal
          ref={(nodeModal) => { this.nodeModal = nodeModal; }}
          {...this.props}
          searchDb={this.searchDb}
          onOpenFile={this.openFileChooseModal}
        />
        <FileChooseModal ref={(fileChoose) => { this.fileChoose = fileChoose; }} suffixs={suffixs} mode='file' pathConfirm={this.pathConfirm}/>
        <FileChooseModal ref={(filePath) => { this.filePath = filePath; }} title='选择路径' pathConfirm={this.pathConfirm} />
      </div>
    );
  }
}

export default DynamicNodes;

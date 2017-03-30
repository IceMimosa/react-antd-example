import * as React from 'react';
import { Modal, Form } from 'antd';
import { SqoopForm, JavaForm, HiveForm, Hive2Form, SparkForm, EmailForm, RemoteSyncForm, ViewValidateForm } from './nodes';
import { baseNodeStyle, boxTypes } from './config';
import { getNodeName, getKeysAndUuid, checkNodeName } from './dynamic';
import './node-modal.scss';

class NodeForm extends React.Component {

  componentDidMount() {
    const { setFieldsValue, getFieldDecorator } = this.props.form;
    const { content } = this.props;
    _.forIn(content, (value, key) => { // 进行绑定
      getFieldDecorator(key);
    });
    setFieldsValue(content);
  }

  generateNodeForm() {
    switch (this.props.type) {
      case 'sqoop':
        return <SqoopForm {...this.props}/>;
      case 'java':
        return <JavaForm {...this.props}/>;
      case 'hive':
        return <HiveForm {...this.props}/>;
      case 'hive2':
        return <Hive2Form {...this.props}/>;
      case 'spark':
        return <SparkForm {...this.props}/>;
      case 'email':
        return <EmailForm {...this.props}/>;
      case 'remoteSync':
        return <RemoteSyncForm {...this.props}/>;
      case 'viewValidate':
        return <ViewValidateForm {...this.props}/>;
      default:
        console.error('node type not exists, current type is ', this.props.type);
        return <div></div>;
    }
  }

  render() {
    return this.generateNodeForm();
  }
}

NodeForm = Form.create({})(NodeForm);

class NodeFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isShow: true,
      type: '',
      content: {},
      uuids: {},
      refresh: false,
    };
    this.cancle = this.cancle.bind(this);
    this.confirm = this.confirm.bind(this);
    this.searchDb = this.searchDb.bind(this);
    this.searchHive = this.searchHive.bind(this); // 绑定获取hive
    this.searchTable = this.searchTable.bind(this); // 获取表
    this.changeView = this.changeView.bind(this); // 是否固定分区
    this.searchPartition = this.searchPartition.bind(this); // 查询键值信息
    this.searchExportKey = this.searchExportKey.bind(this); // 查询唯一更新列
    this.searchExportColumns = this.searchExportColumns.bind(this); // 查询导出顺序列
    this.refreshDb = this.refreshDb.bind(this); // 刷新数据源
    this.searchHiveDatabase = this.searchHiveDatabase.bind(this); // 获取导入收库信息
  }

  // 设置表单值
  setFormValue(fieldsValue) {
    this.nodeform.setFieldsValue(fieldsValue);
  }

  show(info = {}, callback, boxType) {
    const content = info.content ? info.content.toJSON() : {};
    const { onSourceList } = this.props;
    const uuids = {};
    const keysAndUuid = getKeysAndUuid(content, info.type);
    _.forIn(keysAndUuid, (value, key) => {
      content[key] = value.keys;
      uuids[key] = value.uuid;
    });
    if (info.type === 'sqoop') {
      if (content.dbSqoop) this.searchDb(content.dbSqoop);
      onSourceList();
    }
    if (this.nodeform) {
      _.forIn(content, (value, key) => { // 进行绑定
        this.nodeform.getFieldDecorator(key);
      });
      this.nodeform.setFieldsValue(content);
    }
    this.callback = callback;
    this.other = info.other;
    this.boxType = boxType;
    this.setState({ visible: true, type: info.type, content, uuids });
  }

  cancle() {
    this.nodeform.resetFields();
    this.setState({ visible: false });
    if (this.callback) this.callback();
  }

  confirm() {
    const { onNodeEdit, nodeMap, uuid, sourceInfo } = this.props;
    const { isShow } = this.state;
    this.nodeform.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      let sourceName;
      const dbId = parseInt(values.dbSqoop);
      sourceInfo.forEach((item) => {
        if (dbId === item.id) {
          sourceName = item.name;
        }
      });
      const { type } = this.state;
      if (type === 'sqoop') {
        values.tableSqoop = values.tableSqoop.replace('_已分配', '');
        values.sourceNameSqoop = sourceName;
        values.exportFixedPartitionSqoop = isShow;
      }
      const nodeName = getNodeName(values, type);
      if (!checkNodeName(nodeMap, nodeName, this.other.id)) {
        onNodeEdit(nodeMap, uuid, this.other.id, values, this.other, type);
        this.callback({ label: nodeName + '\n' + boxTypes[this.boxType], ...this.other, ...baseNodeStyle });
        this.cancle();
      }
    });
  }

  // 查询数据源
  searchDb(db, refresh) {
    const { sourceInfo } = this.props;
    let dbType;
    sourceInfo.forEach((item) => {
      if (item.id === parseInt(db)) {
        dbType = item.type;
      }
    });
    if (dbType === 4) {
      this.setState({ refresh: true });
    } else {
      this.setState({ refresh: false });
    }
    this.props.searchDb(db, refresh);
    if (this.nodeform && !refresh) this.nodeform.setFieldsValue({ tableSqoop: '' });
  }
  // 查询hive数据库
  searchHive() {
    this.props.searchHive();
  }
  // 获取表
  searchTable(value) {
    this.props.searchTable(value);
  }

  // 是否固定分区
  changeView() {
    this.setState({ isShow: !this.state.isShow });
  }

  // 查询分区键值信息
  searchPartition(value) {
    this.props.searchPartition(value);
  }
  // 查询唯一更新列
  searchExportKey(values) {
    this.props.searchExportKey(parseInt(values.dbSqoop), values.tableSqoop);
  }

  // 查询导出顺序列
  searchExportColumns(values) {
    this.props.searchExportColumns(parseInt(values.dbSqoop), values.tableSqoop);
  }

  // 刷新数据源
  refreshDb(values) {
    const id = values.dbSqoop === undefined ? '' : parseInt(values.dbSqoop);
    this.props.refreshDb(id);
  }

  // 获取导入数据库信息
  searchHiveDatabase() {
    this.props.searchHiveDatabase();
  }

  render() {
    const { exportKey, onOpenFile, defaultAddress, sources, unsignedViews, unsignedTables, signedTables, signedViews, sourceInfo, datalist, hiveInfo, hiveTables, tableName, hiveLoading, isFetchingTables, exportColumns, hiveDatabase, tableFetching } = this.props;
    const { type, content, uuids, isShow, refresh } = this.state;
    return (
      <Modal
        title='编辑节点'
        className='modal-width-570 node-modal'
        visible={this.state.visible}
        onCancel={this.cancle}
        onOk={this.confirm}
      >
        <NodeForm
          ref={(nodeform) => { this.nodeform = nodeform; }}
          exportColumns={exportColumns}
          unsignedViews={unsignedViews}
          exportKey={exportKey}
          isFetchingTables={isFetchingTables}
          hiveLoading={hiveLoading}
          hiveInfo={hiveInfo}
          tableName={tableName}
          hiveTables={hiveTables}
          datalist={datalist}
          sourceInfo={sourceInfo}
          unsignedTables={unsignedTables}
          signedTables={signedTables}
          signedViews={signedViews}
          searchExportKey={this.searchExportKey}
          searchExportColumns={this.searchExportColumns}
          searchDb={this.searchDb}
          refreshDb={this.refreshDb}
          searchTable={this.searchTable}
          searchHive={this.searchHive}
          changeView={this.changeView}
          sources={sources}
          searchPartition={this.searchPartition}
          isShow={isShow}
          tableFetching={tableFetching}
          uuids={uuids}
          type={type}
          content={content}
          onOpenFile={onOpenFile} {...defaultAddress}
          refresh={refresh}
          searchHiveDatabase={this.searchHiveDatabase}
          hiveDatabase={hiveDatabase}
        />
      </Modal>
    );
  }
}

module.exports = NodeFormModal;

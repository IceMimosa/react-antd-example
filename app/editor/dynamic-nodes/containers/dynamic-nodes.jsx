import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as SourceDataAction from 'source-manage/actions';
import Immutable from 'immutable';
import PureDynamicNodes from '../components/dynamic-nodes';
import { getFetchStatus } from 'common/utils/action';
import { nodesToWebJson, transToNetWork, checkRule } from '../components/dynamic';
import * as NodeAction from '../actions';

const mapStateToProps = (state) => {
  return {
    isFetchingTables: getFetchStatus(state, SourceDataAction.getTables),
    tableFetching: getFetchStatus(state, NodeAction.refreshDb),
    defaultAddress: state.defaultAddress,
    hiveLoading: getFetchStatus(state, NodeAction.searchHive),
    hiveInfo: state.hiveInfo.data,
    hiveTables: state.hiveInfo.tables,
    exportKey: state.searchExportKey.exportKey,
    exportColumns: state.searchExportColumns.exportColumns,
    sourceInfo: state.sourceInfo,
    sources: state.sourceList,
    unsignedTables: state.tableList.unsignedTables,
    signedTables: state.tableList.signedTables,
    signedViews: state.tableList.signedViews,
    unsignedViews: state.tableList.unsignedViews,
    tableName: state.searchPartition.tableName,
    hiveDatabase: state.searchHiveDatabase.hiveDatabase,
    datalist: state.tableList.dataSource ? state.tableList.dataSource : {},
    ...state.nodes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNodeDelete: (oldNodeTree, uuid, nodeId) => {
      dispatch(NodeAction.deleteNode(oldNodeTree, uuid, nodeId));
    },
    onNodeEdit: (oldNodeTree, uuid, nodeId, content, other, type) => {
      dispatch(NodeAction.editNode(oldNodeTree, uuid, nodeId, content, other, type));
    },
    onNodeEmpty: () => {
      dispatch(NodeAction.emptyNode());
    },
    onNodeConvert: (webJson) => {
      return dispatch(NodeAction.webJsonConvert(webJson));
    },
    onDefaultAddress: () => {
      dispatch(NodeAction.defaultAddress());
    },
    onSourceList() {
      dispatch(NodeAction.getSourceList());
    },
    onGetTables(id, refresh) {
      return dispatch(SourceDataAction.getTables(id, refresh));
    },
    // 查询hive数据库
    searchHive() {
      dispatch(NodeAction.searchHive());
    },
    // 查询表名
    searchTable(database) {
      dispatch(NodeAction.searchTable(database));
    },
    onEmptyTables() {
      return dispatch(SourceDataAction.emptyTables());
    },
    // 查询分区键值信息
    searchPartition(tableName) {
      return dispatch(NodeAction.searchPartition(tableName));
    },
    // 获取唯一更新列
    searchExportKey(id, tableName) {
      dispatch(NodeAction.searchExportKey(id, tableName));
    },
    // 查询导出顺序列
    searchExportColumns(id, tableName) {
      dispatch(NodeAction.searchExportColumns(id, tableName));
    },
    // 刷新数据表
    refreshDb(id) {
      dispatch(NodeAction.refreshDb(id));
    },
    // 获取导入数据信息
    searchHiveDatabase() {
      dispatch(NodeAction.searchHiveDatabase());
    },
  };
};

class DynamicNodes extends React.Component {

  componentDidMount() {
    const { webJson, onNodeConvert, onDefaultAddress } = this.props;
    if (webJson) {
      onNodeConvert(webJson).then(({ payload }) => {
        this.dyNodes.draw(transToNetWork(payload));
      });
    }
    onDefaultAddress();
  }

  componentWillReceiveProps(nextProps) {
    const { webJson, onNodeConvert, data } = nextProps;
    if (webJson && this.props.webJson !== webJson) {
      onNodeConvert(webJson).then(({ payload }) => {
        this.dyNodes.draw(transToNetWork(payload));
      });
    } else if (data && this.props.data !== data) {
      this.dyNodes.draw(data);
    }
  }

  componentWillUnmount() {
    this.props.onNodeEmpty();
  }

  getWebJson() {
    const network = this.dyNodes.getNetWork();
    let { nodeMap } = this.props;
    let { edges } = network.body.data;
    const { nodes } = network.body;
    const currentEdges = network.body.edges;
    edges = edges.map((edge) => {
      return edge;
    });
    _.forIn(nodes, (node) => {
      nodeMap = nodeMap.updateIn([`${node.id}`], (single) => {
        return single.set('other', Immutable.fromJS({ id: node.id, x: node.x, y: node.y }));
      });
    });
    if (checkRule(nodeMap, currentEdges, null, 'submit')) {
      return nodesToWebJson(nodeMap, edges);
    }
    return {};
  }

  render() {
    return <PureDynamicNodes ref={(dyNodes) => { this.dyNodes = dyNodes; }} {...this.props}/>;
  }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(DynamicNodes);

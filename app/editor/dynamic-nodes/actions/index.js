import { actionTypeCreatorWithNameSpace, createAction } from 'common/utils/action';
import {
  filedMap,
  defaultError,
  paramHiveName,
  paramHiveValue,
  paramHive2Name,
  paramHive2Value,
  argsJavaName,
  argsSparkName,
  jarsSparkName,
  defaultEndName,
  baseEdgeStyle
} from '../components/config';
import { firstWordBig } from '../components/dynamic';
import agent from 'agent';
import Immutable from 'immutable';

const actionTypeCreator = actionTypeCreatorWithNameSpace('dynamicNodes');

export const deleteNode = createAction(actionTypeCreator('deleteNode'), (oldNodeTree, uuid, nodeId) => {
  return { nodeMap: oldNodeTree.remove(`${nodeId}`), uuid };
}, {});

export const editNode = createAction(actionTypeCreator('editNode'), (oldNodeTree, uuid, nodeId, content, other, type) => {
  let nodeMap = oldNodeTree;
  const currnetNode = oldNodeTree.getIn([`${nodeId}`]);
  if (!currnetNode) { //节点不存在，则增加该节点
    const defaultNode = getEmptyNode(nodeId);
    nodeMap = oldNodeTree.merge(defaultNode);
    nodeMap = nodeMap.updateIn([`${nodeId}`], (single) => {
      return single.set('type', type);
    });
    uuid = uuid + 1;
  }
  nodeMap = nodeMap.updateIn([`${nodeId}`], (single) => {
    return single.set('content', Immutable.fromJS(content));
  });
  nodeMap = nodeMap.updateIn([`${nodeId}`], (single) => {
    return single.set('other', Immutable.fromJS(other));
  });
  return { nodeMap, uuid };
}, {});

export const emptyNode = createAction(actionTypeCreator('emptyNode'), () => {
  return {};
}, {});

export const defaultAddress = createAction(actionTypeCreator('defaultAddress'), () => {
  return agent.get(`/api/horus/oozie/template/showDefaultProperty`).then(response => response.body);
});

export const webJsonConvert = createAction(actionTypeCreator('webJsonConvert'), (webJson) => {
  let uuid = 0;
  const nodeMap = {};
  const edges = [];
  const { actions, kills } = JSON.parse(webJson);
  actions && actions.forEach((single) => {
    _.forIn(single, (value, type) => {
      const id = parseInt((value.error.to).split('_')[1]);
      uuid = uuid > id ? uuid : id;
      // 处理nodeMap
      let baseContent = getContent(value, type);
      baseContent = getContentObject(baseContent, value, type);

      baseContent[`error${firstWordBig(type)}`] = getErrorMessageById(id, kills);
      nodeMap[id] = { id, type, content: baseContent, other: value.other };

      // 处理edges
      if (value.ok && value.ok.to !== defaultEndName) {
        edges.push({
          from: id,
          to: value.ok.to,
          ...baseEdgeStyle,
        });
      }
    });
  });

  const promise = new Promise((resolve) => {
    resolve();
  });
  return promise.then(() => { return { nodeMap: Immutable.fromJS(nodeMap), edges, uuid: uuid + 1 } });
}, {});

// 获得空节点
const getEmptyNode = (uuid) => {
  let object = {}
  object[uuid] = { id: uuid, type: 'empty', content: {} }
  return Immutable.fromJS(object)
}

//获得空关系
const getEmptyRelation = (uuid) => {
  let object = {}
  object[uuid] = { id: uuid, children: {} }
  return Immutable.fromJS(object)
}

const getContent = (content, type) => {
  let object = {};
  const bigType = firstWordBig(type);
  object[`name${bigType}`] = content.name;
  _.each(filedMap[type], (field) => {
    object[field + bigType] = content[field];
  });
  object = getOtherContent(object, type, content);
  return object;
};

const objectGenerate = (baseContent, param, paramName, paramV) => {
  let number = 0
  _.forIn(param, (value, key) => {
    baseContent[paramName + number] = key
    baseContent[paramV + number] = value
    number++
  })
  return baseContent
}

const listGenerate = (baseContent, param, paramName) => {
  let number = 0
  _.map(param, (value) => {
    baseContent[paramName + number] = value
    number++
  })
  return baseContent
}

const getContentObject = (baseContent, value, type) => {
  switch (type) {
    case 'hive':
      baseContent = objectGenerate(baseContent, value.param, paramHiveName, paramHiveValue);
      break;
    case 'hive2':
      baseContent = objectGenerate(baseContent, value.param, paramHive2Name, paramHive2Value);
      break;
    case 'java':
      baseContent = listGenerate(baseContent, value.args, argsJavaName);
      break;
    case 'spark':
      baseContent = listGenerate(baseContent, value.args, argsSparkName);
      baseContent = listGenerate(baseContent, value.jars, jarsSparkName);
      break;
    default:
  }
  return baseContent
}

const getOtherContent = (object, type, content) => {
  switch (type) {
    case 'email':
      object.toEmail = content.to.join(';')
      object.ccEmail = content.cc.join(';')
      break;
    case 'sqoop':
      const { dataSource = {} } = content;
      object.operModeSqoop = dataSource.operMode;
      object.synchroModeSqoop = dataSource.synchroMode;
      object.whereConditionSqoop = dataSource.whereCondition;
      object.partitionKeySqoop = dataSource.partitionKey;
      object.partitionValueSqoop = dataSource.partitionValue;
      object.urlSqoop = dataSource.url;
      object.dbUserNameSqoop = dataSource.dbUserName;
      object.dbUserPasswordSqoop = dataSource.dbPassword;
      object.tableNameSqoop = dataSource.tableName;
      object.dbSqoop = dataSource.dataSourceId;
      object.tableSqoop = dataSource.table;
      object.exportPartitionKeySqoop = dataSource.exportPartitionKey;
      object.exportPartitionValueSqoop = dataSource.exportPartitionValue;
      object.exportKeySqoop = dataSource.exportKey;
      object.exportHiveDataBaseSqoop = dataSource.exportHiveDataBase;
      object.exportHiveTableSqoop = dataSource.exportHiveTable;
      object.sourceNameSqoop = dataSource.sourceName;
      object.exportFixedPartitionSqoop = dataSource.exportFixedPartition;
      object.exportPartitionKeyValueSqoop = dataSource.exportPartitionKeyValue;
      object.exportColumnsSqoop = dataSource.exportColumns;
      object.importHiveTableSqoop = dataSource.importHiveTable;
      object.importQuerySqoop = dataSource.importQuery;
      object.importHiveDatabaseSqoop = dataSource.importHiveDatabase;
      object.importEncodingSqoop = dataSource.importEncoding;
      break;
    default:
  }
  return object
}

const getErrorMessageById = (id, kills) => {
  let error = ''
  for (let i = 0; i < kills.length; i++) {
    let single = kills[i]
    if (single.name == `_${id}`) {
      error = single.message == defaultError ? '' : single.message
      break
    }
  }
  return error
}

// 获取数据源
export const getSourceList = createAction(actionTypeCreator('sourceList'), () => {
  return agent.get('/api/horus/source/forJob')
    .then(response => response.body);
}, { fetch: { processing: true } });

// 查询hive数据库
export const searchHive = createAction(actionTypeCreator('searchHive'), () => {
  return agent.get('/api/horus/query/info')
    .then(response => response.body);
}, { fetch: { processing: true } });

// 查询表名
export const searchTable = createAction(actionTypeCreator('searchTable'), (database) => {
  return agent.get(`/api/horus/query/db/change/${database}`)
    .then(response => response.body);
});

// 刷新数据表
export const refreshDb = createAction(actionTypeCreator('refreshDb'), (id) => {
  return agent.put(`/api/horus/source/refresh/${id}`)
    .then(response => response.body);
}, { fetch: { processing: true } });

// 查询分区键值信息
export const searchPartition = createAction(actionTypeCreator('searchPartition'), (tableName) => {
  return agent.get(`/api/horus/query/table/partition/list/${tableName}`)
    .then(response => response.body);
});

// 获取唯一更新列
export const searchExportKey = createAction(actionTypeCreator('searchExportKey'), (id, tableName) => {
  return agent.get(`/api/horus/source/tablesOrViews/${id}/${tableName}/columns`)
    .then(response => response.body);
});

// 获取导出列顺序
export const searchExportColumns = createAction(actionTypeCreator('searchExportColumns'), (id, tableName) => {
  return agent.get(`/api/horus/source/tablesOrViews/${id}/${tableName}/allcolumns`)
    .then(response => response.body);
});

// 获取导入数据库信息
export const searchHiveDatabase = createAction(actionTypeCreator('searchHiveDatabase'), () => {
  return agent.get('/api/horus/query/info')
    .then(response => response.body);
});

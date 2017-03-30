import { message } from 'antd';
import {
  baseNodeStyle,
  paramHiveName,
  paramHiveValue,
  paramHive2Name,
  paramHive2Value,
  argsJavaName,
  argsSparkName,
  jarsSparkName,
  nameMap,
  errorMap,
  filedMap,
  boxTypes,
  defaultError
  // defaultEndName
} from './config';

export const getNodeName = (content, type) => {
  return content[`name${firstWordBig(type)}`];
};

// 获得名称
const getContentName = (node) => {
  if (!node) { // 修正空节点
    return '';
  }
  const type = node.get('type');
  return node.get('content').get(nameMap[type]);
};

// 获得其他信息
const getOtherInfo = (node) => {
  if (!node) { // 修正空节点
    return '';
  }
  return node.get('other').toJSON();
};

// 获得错误消息
const getErrorMessage = (node) => {
  const type = node.get('type');
  return node.get('content').get(errorMap[type]) || defaultError;
};

const getKills = (nodeMap, id, kills) => {
  const node = nodeMap.get(`${id}`);
  const name = getContentName(node);
  if (id > 0 && name) {
    kills.push({ name: `_${id}`, message: getErrorMessage(node) });
  }
  return kills;
};

// 获得节点数据
const getFormData = (node) => {
  const type = node.get('type');
  const content = node.get('content');
  const fields = filedMap[type] ? filedMap[type] : [];
  let data = {};
  fields.forEach((single) => {
    const value = content.get(single + firstWordBig(type));
    if (value) data[single] = value;
  });
  data = getOtherData(data, type, content);
  data = getObjectData(data, type, content);
  return data;
};

// 其他数据组织
const getOtherData = (data, type, content) => {
  switch (type) {
    case 'email':
      data.to = content.get('toEmail').split(';');
      data.cc = content.get('ccEmail').split(';');
      break;
    case 'sqoop':
      const dataSource = {};
      dataSource.partitionKey = data.partitionKey;
      dataSource.partitionValue = data.partitionValue;
      dataSource.whereCondition = data.whereCondition;
      dataSource.url = data.url;
      dataSource.tableName = data.table;
      dataSource.dbUserName = data.dbUserName;
      dataSource.dbPassword = data.dbUserPassword ? data.dbUserPassword : '';
      dataSource.operMode = data.operMode;
      dataSource.synchroMode = data.synchroMode;
      dataSource.table = data.table;
      dataSource.type = data.type;
      dataSource.host = data.host;
      dataSource.port = data.port;
      dataSource.dataBase = data.dbName;
      dataSource.dataSourceId = data.db;
      dataSource.exportPartitionKey = data.exportPartitionKey;
      dataSource.exportPartitionValue = data.exportPartitionValue;
      dataSource.exportKey = data.exportKey;
      dataSource.exportHiveDataBase = data.exportHiveDataBase;
      dataSource.exportHiveTable = data.exportHiveTable;
      dataSource.exportPartitionKeyValue = data.exportPartitionKeyValue;
      dataSource.exportFixedPartition = data.exportFixedPartition;
      dataSource.sourceName = data.sourceName;
      dataSource.exportColumns = data.exportColumns;
      dataSource.importHiveTable = data.importHiveTable;
      dataSource.importQuery = data.importQuery;
      dataSource.importHiveDatabase = data.importHiveDatabase;
      dataSource.importEncoding = data.importEncoding;
      data.dataSource = dataSource;
      data = _.omit(data, ['sourceName', 'exportPartitionKeyValue', 'exportFixedPartition', 'exportPartitionKey', 'exportPartitionValue', 'exportKey', 'exportHiveDataBase', 'exportHiveTable', 'table', 'partitionKey', 'partitionValue', 'whereCondition', 'url', 'tableName', 'dbUserName', 'dbUserPassword', 'operMode', 'synchroMode', 'exportColumns', 'importHiveTable', 'importQuery', 'importHiveDatabase', 'importEncoding']);
      break;
    default:
  }
  return data;
};

// 批量对象转化
export const paramObjectShow = (content, paramKey, paramV) => {
  const param = [];
  _.forIn(content, (value, key) => {
    if (key.indexOf(paramKey) > -1) {
      const number = key.split(paramKey)[1];
      const paramValue = content[paramV + number];
      param.push({ name: content[key], value: paramValue });
    }
  });
  return param;
};

// 批量数组转化
export const paramListShow = (content, paramKey) => {
  const param = [];
  _.forIn(content, (value, key) => {
    if (key.indexOf(paramKey) > -1) {
      const number = key.split(paramKey)[1];
      const paramValue = content[paramKey + number];
      param.push(paramValue);
    }
  });
  return param;
};

export const paramObject = (content, paramKey, paramV) => {
  const param = {};
  _.forIn(content, (value, key) => {
    if (key.indexOf(paramKey) > -1) {
      const number = key.split(paramKey)[1];
      const paramValue = content[paramV + number];
      param[content[key]] = paramValue;
    }
  });
  return param;
};

const paramList = (content, paramKey) => {
  const param = [];
  _.forIn(content, (value, key) => {
    if (key.indexOf(paramKey) > -1) {
      const number = key.split(paramKey)[1];
      const paramValue = content[paramKey + number];
      param.push(paramValue);
    }
  });
  return param;
};

// 组织批量对象数据
const getObjectData = (data, type, content) => {
  content = content.toJSON();
  switch (type) {
    case 'hive':
      data.param = paramObject(content, paramHiveName, paramHiveValue);
      break;
    case 'hive2':
      data.param = paramObject(content, paramHive2Name, paramHive2Value);
      break;
    case 'java':
      data.args = paramList(content, argsJavaName);
      break;
    case 'spark':
      data.args = paramList(content, argsSparkName);
      data.jars = paramList(content, jarsSparkName);
      break;
    default:
  }
  return data;
};

export const firstWordBig = (words) => {
  return words[0].toUpperCase() + words.slice(1, words.length)
};

const getActions = (nodeMap, id, childId, actions) => {
  const object = {};
  const node = nodeMap.get(`${id}`);
  const type = node.get('type');
  const childNode = nodeMap.get(`${childId}`);
  const childName = childId > 0 ? getContentName(childNode) : '';
  if (id > 0) {
    object[type] = Object.assign({}, {
      name: getContentName(node),
      other: getOtherInfo(node),
      ok: { to: childName || '' },
      error: { to: `_${id}` },
      prepare: [],
      configuration: {},
    }, getFormData(node));
    actions.push(object);
  }
  return actions;
};

const handleNodes = (nodeMap, edges) => {
  const nodeMapObject = nodeMap.toJSON();
  let kills = [];
  const fromTo = {};
  let actions = [];
  edges && edges.forEach((edge) => {
    if (!fromTo[edge.from]) {
      fromTo[edge.from] = [];
    }
    if (edge.to) {
      fromTo[edge.from].push(edge.to);
    }
  });
  _.forIn(nodeMapObject, (value) => {
    kills = getKills(nodeMap, value.id, kills);
    if (fromTo[value.id] && fromTo[value.id].length > 0) {
      fromTo[value.id].forEach((toId) => {
        actions = getActions(nodeMap, value.id, toId, actions);
      });
    } else {
      actions = getActions(nodeMap, value.id, null, actions);
    }
  });
  return { kills, actions };
};

// 获得起始节点, desperate: 降低算法复杂度
const getStartNode = (edges = [], nodeMap) => {
  let start = [];
  edges.forEach(({ from }) => {
    start.push(getRootNode(from, edges));
  });
  start = _.uniq(start);
  if (nodeMap) { // 提交的时候
    const name = getContentName(nodeMap.get(`${start[0]}`));
    return { to: name };
  }
  return start; // 做其他操作的时候
};

// 找到某点的根节点
const getRootNode = (current, edges) => {
  let root = current;
  edges.forEach(({ from, to }) => {
    if (to === current) {
      root = getRootNode(from, edges);
    }
  });
  return root;
};

const checkWebJson = (webJson) => {
  let words = '';
  const { start, end, kills, actions } = webJson;
  // if (!start.to || !end.name) {
  //   words = '视图没有添加节点,或者首/尾节点内容不完整';
  // } else
  // if ((kills && kills.length === 0) || actions.length < kills.length) {
  //   words = '视图没有节点,或者存在空白节点';
  // }
  if (words) message.error(words);
  return !words;
};

// 转化为json
export const nodesToWebJson = (nodeMap, edges) => {
  const webJson = handleNodes(nodeMap, edges);
  if (checkWebJson(webJson)) {
    return webJson;
  }
  return {};
};

const getParamKey = (type) => {
  let paramKey = '';
  switch (type) {
    case 'hive':
      paramKey = [paramHiveName];
      break;
    case 'hive2':
      paramKey = [paramHive2Name];
      break;
    case 'java':
      paramKey = [argsJavaName];
      break;
    case 'spark':
      paramKey = [argsSparkName, jarsSparkName];
      break;
    default:
  }
  return paramKey;
};

export const getKeysAndUuid = (content, type) => {
  const object = {};
  const paramKeys = getParamKey(type);
  if (!paramKeys) {
    return;
  }
  paramKeys.forEach((single) => {
    object['keys' + single.split('-')[0]] = getCertainKeysAndUuid(content, single);
  });
  return object;
};

const getCertainKeysAndUuid = (content, paramKey) => {
  const keys = [];
  let uuid = 0;
  _.forIn(content, (value, key) => {
    if (key.indexOf(paramKey) > -1) {
      const number = parseInt(key.split(paramKey)[1]);
      uuid = uuid > number ? uuid : number;
      keys.push(number);
    }
  });
  return { keys, uuid };
};

export const getMapKeysAndUuid = (content) => {
  const keys = [];
  let uuid = 0;
  _.forIn(content, (value, key) => {
    keys.push(uuid);
    uuid++;
  });
  return { keys, uuid };
};

export const checkHiveTable = (rules, value, callback) => {
  const res = /^\w+$/;
  if (!res.test(value)) {
    callback(new Error('数据库名只允许数字、字母、下划线'));
  } else {
    callback();
  }
};

export const transToNetWork = (payload) => {
  let { nodeMap, edges } = payload;
  nodeMap = nodeMap.toJSON();
  const nodes = [];
  const nameToKey = {};
  _.forIn(nodeMap, (value, key) => {
    key = parseInt(key);
    const { type, content, other = {} } = value;
    const { x, y } = other;
    nameToKey[content['name' + firstWordBig(type)]] = key;
    if (boxTypes[type]) {
      nodes.push({
        id: key,
        label: content['name' + firstWordBig(type)] + '\n' + boxTypes[type],
        ...baseNodeStyle,
        x,
        y,
      });
    }
  });

  edges = edges.map((edge) => {
    edge.to = nameToKey[edge.to];
    return edge;
  });

  return { nodes, edges };
};

// 校验节点名称是否重复
export const checkNodeName = (nodeMap, nodeName, nodeId) => {
  let nameExits = false;
  const nodeMapObject = nodeMap.toJSON();
  _.forIn(nodeMapObject, (value, key) => {
    const { type, content } = value;
    const currentName = content['name' + firstWordBig(type)];
    if (key != nodeId && currentName === nodeName) {
      nameExits = true;
    }
  });
  if (nameExits) {
    message.error('节点名称不能重复');
  }
  return nameExits;
};

const addToFromTo = (fromTo, from, to) => {
  if (!fromTo[from]) {
    fromTo[from] = [];
  }
  fromTo[from].push(to);
  return fromTo;
};

// 校验规则
export const checkRule = (nodeMap, edgesObj = [], current, checkType) => {
  const edges = [];
  let fromTo = {};
  if (current) {
    fromTo = addToFromTo(fromTo, current.from, current.to);
    edges.push(current);
  }
  _.forIn(edgesObj, (value) => {
    edges.push({ from: value.fromId, to: value.toId });
    fromTo = addToFromTo(fromTo, value.fromId, value.toId);
  });

  let rulePass = true;
  if ((!checkType || checkType === 'add') && checkNodeIsLoop(fromTo, current)) {
    rulePass = false;
  }
  // else if (checkType === 'submit' && (checkHasMutiBranch(fromTo) || checkHasMutiEnd(nodeMap, fromTo))) {
  //   rulePass = false;
  // }
  return rulePass;
};

// 校验节点连线是否形成回环
const checkNodeIsLoop = (fromTo, current) => {
  const { from, to } = current;
  let loopExits = false;
  const loop = (toId) => {
    const nextIds = fromTo[toId] ? fromTo[toId] : [];
    if (_.indexOf(nextIds, from) > -1) {
      message.error('该连线将会形成回环,造成无限循环,请重新连线');
      loopExits = true;
    } else if (nextIds && !loopExits) {
      nextIds.map((nextId) => {
        loop(nextId);
      });
    }
  };
  loop(to);
  return loopExits;
};

// 校验节点连线是否存在多分支
const checkHasMutiBranch = (fromTo) => {
  let mutiExits = false;
  let number = 0;
  _.forIn(fromTo, (value, key) => {
    if (value.length > 1) {
      number++;
    }
  });
  if (number > 1) {
    mutiExits = true;
    message.error('当前只能存在一个多分支节点,请重新连线');
  }
  return mutiExits;
};

// 校验节点是否存在多个结束节点
const checkHasMutiEnd = (nodeMap, fromTo) => {
  const nodeMapObject = nodeMap.toJSON();
  let mutiExits = false;
  let endNumber = 0;
  _.forIn(nodeMapObject, (value, key) => {
    if (!fromTo[key]) {
      endNumber++;
    }
  });
  if (endNumber > 1) {
    mutiExits = true;
    message.error('当前只能存在一个结束节点,请继续连线');
  }
  return mutiExits;
};

// 重置节点位置
export const getRightPosition = (styleNodes, edges) => {
  let resetNodes = [];
  let fromTo = {};
  const start = getStartNode(edges);
  edges.map((value) => {
    fromTo = addToFromTo(fromTo, value.from, value.to);
  });
  const position = levelsPosition(start, fromTo);
  resetNodes = styleNodes.map((node, id) => {
    return {...node, ...position[id] };
  });
  return resetNodes;
};

// 分解为层级位置
const levelDistance = 100;
const betweenDistance = 150;
const levelsPosition = (start, fromTo) => {
  const position = {};
  let count = 0;
  const levels = { 0: start };
  const loop = (array = []) => {
    count++;
    array.forEach((begin) => {
      if (!levels[count]) {
        levels[count] = [];
      }
      if (fromTo[begin]) {
        levels[count] = _.uniq([...levels[count], ...fromTo[begin]]);
      }
    });
    if (levels[count] && levels[count].length > 0) {
      loop(levels[count]);
    }
  };
  loop(start);
  _.forIn(levels, (value, key) => {
    const yBase = key * levelDistance;
    let xBegin = 0;
    if (value.length > 1) {
      xBegin = -(value.length - 1) / 2 * betweenDistance;
    }
    let number = 0;
    value.map((single) => {
      position[single] = { y: yBase, x: xBegin + number * betweenDistance };
      number++;
    });
  });
  return position;
};

const menuWidth = 140;
const menuHeight = 100;
export const getRightMenuPos = (x, y, $netWork) => {
  let left = x,
    top = y;
  const { offsetWidth: netWidth, offsetHeight: netHeight } = $netWork;

  if (menuWidth + left >= netWidth) {
    left = left - menuWidth;
  } else {
    left = left + menuWidth / 2;
  }

  if (menuHeight + top >= netHeight) {
    top = top - menuHeight;
  }

  return { left, top };
};

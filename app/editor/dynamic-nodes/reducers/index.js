import { createReducer } from 'common/utils/reducer';
import * as nodeAction from '../actions';
import Immutable from 'immutable';

const initNodes = {
  nodeMap: Immutable.fromJS({}), //数据模型
  uuid: 1
}

export const nodes = createReducer(on => {
  on(nodeAction.deleteNode)
    .completed((state, action) => {
      return action.payload;
    });
  on(nodeAction.editNode)
    .completed((state, action) => {
      return action.payload;
    });
  on(nodeAction.emptyNode)
    .completed((state, action) => {
      return initNodes;
    });
  on(nodeAction.webJsonConvert)
    .completed((state, action) => {
      return action.payload;
    });
}, initNodes);

export const defaultAddress = createReducer(on => {
  on(nodeAction.defaultAddress)
    .completed((state, action) => {
      return action.payload;
    });
}, { hiveJdbc: '', spark: '' });

export const sourceInfo = createReducer(on => {
  on(nodeAction.getSourceList)
    .completed((state, action) => {
      return action.payload;
    });
}, []);

// hive数据库store
export const hiveInfo = createReducer((on) => {
  on(nodeAction.searchHive).completed((state, action) => {
    const database = [];
    const databases = action.payload.databases;
    databases.map((item) => {
      return database.push(item.name);
    });
    return { data: database, tables: action.payload.tables };
  });
  on(nodeAction.searchTable).completed((state, action) => {
    const database = [];
    const databases = action.payload.databases;
    databases.map((item) => {
      return database.push(item.name);
    });
    return { data: database, tables: action.payload.tables };
  });
  on(nodeAction.refreshDb).completed((state, action) => {
    const database = [];
    const databases = action.payload.databases;
    databases.map((item) => {
      return database.push(item.name);
    });
    return { data: database, tables: action.payload.tables };
  });
}, { data: [], tables: [] });

// 分区键值信息
export const searchPartition = createReducer((on) => {
  on(nodeAction.searchPartition).completed((state, action) => {
    return { tableName: action.payload };
  });
}, { tableName: [] });

// 唯一更新列信息
export const searchExportKey = createReducer((on) => {
  on(nodeAction.searchExportKey).completed((state, action) => {
    return { exportKey: action.payload };
  });
}, { exportKey: [] });

// 导出列顺序信息
export const searchExportColumns = createReducer((on) => {
  on(nodeAction.searchExportColumns).completed((state, action) => {
    return { exportColumns: action.payload };
  });
}, { exportColumns: [] });

// 导入数据库信息
export const searchHiveDatabase = createReducer((on) => {
  on(nodeAction.searchHiveDatabase).completed((state, action) => {
    return { hiveDatabase: action.payload.databases };
  });
}, { hiveDatabase: [] });
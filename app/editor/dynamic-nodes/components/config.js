/*
 * vis节点样式相关配置
 */
export const baseNodeStyle = {
  shape: 'box',
  borderWidthSelected: 1,
  color: {
    border: '#1eb6f8',
    background: '#ffffff',
    highlight: {
      border: '#0fd9b2',
      background: '#ffffff',
    },
    hover: {
      border: '#0fd9b2',
      background: '#ffffff',
    },
  },
  shapeProperties: {
    borderDashes: false, // only for borders
    borderRadius: 2, // only for box shape
    interpolation: true, // only for image and circularImage shapes
    useImageSize: false, // only for image and circularImage shapes
    useBorderWithImage: false, // only for image shape
  },
};

export const baseEdgeStyle = {
  arrows: {
    from: { scaleFactor: 0.3, type: 'circle' },
    to: { scaleFactor: 0.3, type: 'circle' },
    middle: { scaleFactor: 0.5 },
  },
  smooth: { type: 'cubicBezier' },
  selectionWidth: 1,
  color: {
    color: '#1eb6f8',
    highlight: '#0fd9b2',
    hover: '#0fd9b2',
    inherit: 'from',
    opacity: 1.0,
  },
};

/*
 * 表单字段相关配置
 */

export const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};

export const boxTypes = {
  'sqoop': 'Sqoop',
  'java': 'Java',
  'hive': 'Hive',
  'hive2': 'Hive2',
  'spark': 'Spark',
  'email': 'Email',
  'remoteSync': '文件同步',
  'viewValidate': '视图验证',
};

export const boxNameTypes = {
  'Sqoop': 'sqoop',
  'Java': 'java',
  'Hive': 'hive',
  'Hive2': 'hive2',
  'Spark': 'spark',
  'Email': 'email',
  '文件同步': 'remoteSync',
  '视图验证': 'viewValidate',
};

export const nameMap = {
  'sqoop': 'nameSqoop',
  'java': 'nameJava',
  'hive': 'nameHive',
  'hive2': 'nameHive2',
  'spark': 'nameSpark',
  'email': 'nameEmail',
  'remoteSync': 'nameRemoteSync',
  'viewValidate': 'nameViewValidate',
};

export const errorMap = {
  'sqoop': 'errorSqoop',
  'java': 'errorJava',
  'hive': 'errorHive',
  'hive2': 'errorHive2',
  'spark': 'errorSpark',
  'email': 'errorEmail',
  'remoteSync': 'errorRemoteSync',
  'viewValidate': 'errorViewValidate',
};

export const nodesList = [{
  id: 1,
  type: 'sqoop',
  img: '/images/resources/sqoop-32.png',
  name: '数据同步',
}, {
  id: 2,
  type: 'java',
  img: '/images/resources/java-32.png',
  name: 'java',
}, {
  id: 4,
  type: 'hive2',
  img: '/images/resources/hive-32.png',
  name: 'hive2脚本',
}, {
  id: 5,
  type: 'spark',
  img: '/images/resources/spark-32.png',
  name: 'spark',
}, {
  id: 7,
  type: 'remoteSync',
  img: '/images/resources/sync-32.png',
  name: '文件同步',
}, {
  id: 8,
  type: 'viewValidate',
  img: '/images/resources/viewValidate-32.png',
  name: '视图验证',
}];

// {
//   id: 3,
//   type: 'hive',
//   img: '/images/resources/hive-32.png',
//   name: 'hive',
// },

// {
//   id: 6,
//   type: 'email',
//   img: '/images/resources/email-32.png',
//   name: 'email',
// },

export const filedMap = {
  'sqoop': ['sourceName', 'exportPartitionKeyValue', 'exportFixedPartition', 'exportPartitionKey', 'exportPartitionValue', 'exportKey', 'exportHiveDataBase', 'exportHiveTable', 'jobXml', 'command', 'whereCondition', 'partitionValue', 'partitionKey', 'url', 'table', 'dbUserName', 'dbUserPassword', 'operMode', 'synchroMode', 'db', 'type', 'host', 'port', 'dataBase', 'dbName', 'exportColumns', 'importHiveTable', 'importQuery', 'importHiveDatabase', 'importEncoding'],
  'java': ['libPath', 'mainClass', 'javaOpts'],
  'hive': ['jobXml', 'scriptPath'],
  'hive2': [/*'jobXml', 'jdbcUrl', 'password',*/ 'scriptPath', 'jdbcType'],
  'spark': ['jobXml', 'master', 'sparkJobName', 'mode', 'mainClass', 'sparkOpts'],
  'email': ['subject', 'body', 'contentType', 'to', 'cc'],
  'remoteSync': [
    'protocol', 'hiveDatabase', 'hiveTable', 'fileType', 'fileName', 'remotePath', 'ptDate',
    'hdfsUrl', 'hiveUrl', 'backup', 'encryptType', 'decryptKey', 'excelPwd', 'split', 'columns',
    'comments', 'ignoreLine', 'requestBody', 'method', 'namespace', 'resultKeys', 'host',
    'port', 'username', 'password'
  ],
  'viewValidate': ['hiveUrl', 'table', 'partitionKey', 'partitionValue', 'operation', 'sql'],
};

// 统一的批量录入格式
export const paramHiveName = 'paramHive-name';
export const paramHiveValue = 'paramHive-value';
export const paramHive2Name = 'paramHive2-name';
export const paramHive2Value = 'paramHive2-value';
export const argsJavaName = 'argsJava-name';
export const argsSparkName = 'argsSpark-name';
export const jarsSparkName = 'jarsSpark-name';

export const defaultError = 'Action failed, error message[${wf:errorMessage(wf:lastErrorNode())}]';
export const defaultEndName = '_end_';

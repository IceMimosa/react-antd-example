import { Form, Input, Select, Radio, Switch, Spin } from 'antd';
import { Icon } from 'common';
import { checkNodeName, checkTableName } from 'scripts';
import { MutiInput } from './muti';
import { formItemLayout, checkHiveTable } from './config';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

export const PathSelect = ({ onClick, words }) => {
  return <a className='path' href='javascript:;' onClick={onClick}>{words}</a>;
};

const fileTypeXml = ['xml'];
const fileTypeJar = ['jar'];
const fileTypeSpark = ['jar', 'py'];
const fileTypeHive = ['q'];
const filePathRemoteSync = 'path';
const fileTypeRemoteSync = ['txt', 'excel'];

export const SqoopForm = ({ form, changeView, searchExportKey, searchExportColumns, searchPartition, searchHive, searchTable, refreshDb, searchDb, searchHiveDatabase, ...other }) => {
  const { getFieldDecorator, getFieldValue, getFieldsValue } = form;
  const operModeSqoop = getFieldValue('operModeSqoop');
  const dbSqoop = getFieldValue('dbSqoop');
  const tableSqoop = getFieldValue('tableSqoop');
  const synchroModeSqoop = getFieldValue('synchroModeSqoop');
  const fieldsValue = getFieldsValue();
  const tempId = (new Date()).valueOf();
  const { exportKey, sourceInfo, datalist, unsignedViews = [], unsignedTables = [], signedTables = [], signedViews = [], hiveInfo, hiveTables, isShow, tableName, hiveLoading, isFetchingTables, exportColumns, refresh, hiveDatabase, tableFetching } = other;
  let data = [];
  const spinStatus = isFetchingTables === true ? isFetchingTables : tableFetching;
  const siTables = [];
  const siViews = [];
  signedTables.map((item) => {
    siTables.push(item + '_已分配');
  });
  signedViews.map((item) => {
    siViews.push(item + '_已分配');
  });

  if (unsignedTables && signedTables && unsignedViews && signedViews) {
    data = unsignedViews.concat(unsignedTables).concat(siTables).concat(siViews);
  }
  getFieldDecorator('dbNameSqoop', { value: datalist.dbName });
  getFieldDecorator('typeSqoop', { value: datalist.type });
  getFieldDecorator('hostSqoop', { value: datalist.host });
  getFieldDecorator('portSqoop', { value: datalist.port });
  getFieldDecorator('urlSqoop', { value: datalist.url });
  getFieldDecorator('dataBaseSqoop', { value: datalist.dataBase });
  getFieldDecorator('dbUserNameSqoop', { value: datalist.dbUserName });
  getFieldDecorator('dbUserPasswordSqoop', { value: datalist.dbUserPassword ? datalist.dbUserPassword : '' });
  return (
    <div id={tempId}>
      <FormItem label='请选择' {...formItemLayout}>
        {getFieldDecorator('operModeSqoop', {
          rules: [{ required: true, message: '请选择' }], initialValue: 'import',
        })(<RadioGroup >
          <Radio key='import' value='import'>导入</Radio>
          <Radio key='output' value='export' onFocus={searchHive}>导出</Radio>
        </RadioGroup>
        )}
      </FormItem>
      <FormItem label='请选择' {...formItemLayout}>
        {getFieldDecorator('synchroModeSqoop', {
          rules: [{ required: true, message: '请选择' }], initialValue: 'increment',
        })(<RadioGroup >
          <Radio key='full' value='full'>全量</Radio>
          <Radio key='increment' value='increment'>增量</Radio>
        </RadioGroup>
        )}
      </FormItem>
      <FormItem label='节点名称' {...formItemLayout}>
        {getFieldDecorator('nameSqoop', {
          rules: [{ required: true, message: '请输入节点名称' }, { validator: checkNodeName }],
        })(<Input placeholder='请输入节点名称'/>)}
      </FormItem>
      {operModeSqoop === 'export' ? <span><FormItem label='hive数据库' {...formItemLayout}>
        {getFieldDecorator('exportHiveDataBaseSqoop', { rules: [{ required: true, message: '请选择hive数据库' }] })(
          <Select showSearch onChange={searchTable} style={{ width: '100%' }} placeholder='请选择hive数据库' getPopupContainer={() => document.getElementById(tempId)}>
            {hiveInfo.map((item) => {
              return <Option key={item} value={item}>{item}</Option>;
            })}
          </Select>)}
      </FormItem>
        <FormItem label='hive表' {...formItemLayout}>
          <Spin spinning={hiveLoading} tip='正在查询...'>
            {getFieldDecorator('exportHiveTableSqoop', { rules: [{ required: true, message: '请选择hive表' }] })(<Select showSearch onChange={searchPartition} style={{ width: '100%' }} placeholder='请选择hive表' getPopupContainer={() => document.getElementById(tempId)}>
              {hiveTables.map((item) => {
                return <Option key={item} value={item}>{item}</Option>;
              })}
            </Select>)}
          </Spin>
        </FormItem>
        { synchroModeSqoop === 'full' ? undefined : <div>
          <FormItem {...formItemLayout} label='是否固定分区'>
            {getFieldDecorator('exportFixedPartitionSqoop')(<Switch checked={isShow} onChange={changeView}/>)}
          </FormItem>
          {isShow === true ? <span><FormItem label='导出分区键值' {...formItemLayout}>
            {getFieldDecorator('exportPartitionKeyValueSqoop', { rules: [{ required: true, message: '请选择导出分区键值' }] })(<Select showSearch style={{ width: '100%' }} placeholder='请输入导出分区键值' getPopupContainer={() => document.getElementById(tempId)}>
              {tableName.map((item) => {
                return <Option key={item} value={item}>{item}</Option>;
              })}
            </Select>)}
          </FormItem></span> : <span><FormItem label='导出分区键' {...formItemLayout}>
            {getFieldDecorator('exportPartitionKeySqoop', { rules: [{ required: true, message: '请输入导出分区值' }] })(<Input placeholder='请输入导出分区键' />)}
          </FormItem>
            <FormItem label='导出分区值' {...formItemLayout}>
              {getFieldDecorator('exportPartitionValueSqoop', { rules: [{ required: true, message: '请输入导出分区值' }] })(<Input placeholder='请输入导出分区值' />)}
            </FormItem></span>}
        </div>}
      </span> : undefined }
      <FormItem label='数据源' {...formItemLayout}>
        {getFieldDecorator('dbSqoop', {
          rules: [{ required: true, message: '请选择数据源' }],
        })(
          <Select showSearch placeholder='请选择数据源' onChange={searchDb} style={{ width: '100%' }} addonAfter='sssss' getPopupContainer={() => document.getElementById(tempId)}>
            { sourceInfo ? sourceInfo.map((source) => {
              return <Option key={source.id} value={`${source.id}`}>{source.name}</Option>;
            }) : ''}
          </Select>
          )}
      </FormItem>
      <FormItem label='数据表' {...formItemLayout} style={{ position: 'relative' }}>
        <Spin spinning={spinStatus} tip='正在拉取数据表'>
          {getFieldDecorator('tableSqoop', {
            rules: [{ required: true, message: '请选择数据表' }],
          })(
            <Select showSearch placeholder='请选择数据表' style={{ width: '100%' }} getPopupContainer={() => document.getElementById(tempId)}>
              {data.map((table) => {
                return <Option key={table} value={table}>{table}</Option>;
              })}
            </Select>
          )}
          <Icon type='refresh' className='fresh-icon' style={{ position: 'absolute', right: -30, top: 10, cursor: 'pointer' }} onClick={() => searchDb(dbSqoop, true)} />
        </Spin>
      </FormItem>
      { operModeSqoop === 'import' ?
        <span>
          <FormItem label='导入表名' {...formItemLayout}>
            {getFieldDecorator('importHiveTableSqoop', { rules: [{ validator: checkHiveTable }] })(<Input placeholder='请输入导入的表名称'/>)}
          </FormItem>
          <FormItem label='导入数据库名' {...formItemLayout}>
            {getFieldDecorator('importHiveDatabaseSqoop')(<Select onFocus={searchHiveDatabase} placeholder='请选择导入的数据库的名称' style={{ width: '100%' }} getPopupContainer={() => document.getElementById(tempId)}>
              {hiveDatabase.map((item) => {
                return <Option key={item.name} value={item.name}>{item.name}</Option>;
              })}
            </Select>)}
          </FormItem>
          {/*
          <FormItem label='错误提示' {...formItemLayout}>
            {getFieldDecorator('errorSqoop')(<Input placeholder='请输入错误提示'/>)}
          </FormItem>
          */}
          <FormItem label='分区字段名' {...formItemLayout}>
            {getFieldDecorator('partitionKeySqoop')(<Input placeholder='请输入分区字段名'/>)}
          </FormItem>
          <FormItem label='分区值' {...formItemLayout}>
            {getFieldDecorator('partitionValueSqoop')(<Input placeholder='请输入分区值'/>)}
          </FormItem>
          <FormItem label='己方数据库编码' {...formItemLayout}>
            {getFieldDecorator('importEncodingSqoop')(
              <Select style={{ width: '100%' }} placeholder='请选择己方数据库编码'>
                <Option value='ISO8859-1' key='ISO8859-1'>ISO8859-1</Option>
              </Select>)}
          </FormItem>
          <FormItem label='where条件' {...formItemLayout}>
            {getFieldDecorator('whereConditionSqoop')(<Input placeholder='请输入where条件'/>)}
          </FormItem>
          <FormItem label='附加query条件' {...formItemLayout}>
            {getFieldDecorator('importQuerySqoop')(<Input placeholder='请输入附加query条件'/>)}
          </FormItem>
        </span> :
        <span>
          <FormItem label='更新列' {...formItemLayout}>
            {getFieldDecorator('exportKeySqoop')(
              <Select disabled={!(dbSqoop && tableSqoop)} multiple showSearch onFocus={() => searchExportKey(fieldsValue)} placeholder='请选择更新列,可多选' style={{ width: '100%' }} getPopupContainer={() => document.getElementById(tempId)}>
                {exportKey.map((item) => {
                  return <Option key={item} value={item}>{item}</Option>;
                })}
              </Select>)}
          </FormItem>
          <FormItem label='导出列' {...formItemLayout}>
            {getFieldDecorator('exportColumnsSqoop')(
              <Select disabled={!(dbSqoop && tableSqoop)} showSearch multiple style={{ width: '100%' }} onFocus={() => searchExportColumns(fieldsValue)} placeholder='请选择导出顺序列' getPopupContainer={() => document.getElementById(tempId)}>
                {exportColumns.map((item) => {
                  return <Option key={item} value={item}>{item}</Option>;
                })}
              </Select>)}
          </FormItem>
        </span> }
    </div>
  );
};

export const JavaForm = ({ form, onOpenFile, uuids }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const libPathJava = getFieldValue('libPathJava');
  return (
    <div>
      <FormItem label='名称' {...formItemLayout}>
        {getFieldDecorator('nameJava', {
          rules: [{ required: true, message: '请输入节点名称' }, { validator: checkNodeName }]
        })(<Input placeholder='请输入节点名称'/>)}
      </FormItem>
      <FormItem label='jar包路径' {...formItemLayout}>
        {getFieldDecorator('libPathJava', {
          rules: [{ required: true, message: '请选择jar包' }],
        })(
          <div>
            <PathSelect onClick={() => onOpenFile('libPathJava', fileTypeJar)} words={libPathJava || '请选择jar包的路径'}/>
          </div>
        )}
      </FormItem>
      <FormItem label='main方法类' {...formItemLayout}>
        {getFieldDecorator('mainClassJava')(<Input placeholder='请输入main方法类'/>)}
      </FormItem>
      <MutiInput name='参数组' keywords='argsJava' mutiType='list' uuid={uuids.keysargsJava} form={form} layout={formItemLayout}/>
      <FormItem label='错误提示' {...formItemLayout}>
        {getFieldDecorator('errorJava')(<Input placeholder='请输入错误提示'/>)}
      </FormItem>
    </div>
  );
};

export const HiveForm = ({ form, onOpenFile, uuids }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const jobXmlHive = getFieldValue('jobXmlHive');
  const scriptPathHive = getFieldValue('scriptPathHive');
  return (
    <div>
      <FormItem label='名称' {...formItemLayout}>
        {getFieldDecorator('nameHive', {
          rules: [{ required: true, message: '请输入节点名称' }, { validator: checkNodeName }],
        })(<Input placeholder='请输入节点名称'/>)}
      </FormItem>
      <FormItem label='hive脚本路径' {...formItemLayout}>
        {getFieldDecorator('scriptPathHive', {
          rules: [{ required: true, message: '请选择hive脚本' }],
        })(
          <div>
            <PathSelect onClick={() => onOpenFile('scriptPathHive', fileTypeHive)} words={scriptPathHive || '请选择hive脚本路径, .q后缀'}/>
          </div>
        )}
      </FormItem>
      <FormItem label='xml文件路径' {...formItemLayout}>
        {getFieldDecorator('jobXmlHive')(
          <PathSelect onClick={() => onOpenFile('jobXmlHive', fileTypeXml)} words={jobXmlHive || '请选择xml文件路径'}/>
        )}
      </FormItem>
      <MutiInput name='参数组' keywords='paramHive' uuid={uuids.keysparamHive} form={form}/>
      <FormItem label='错误提示' {...formItemLayout}>
        {getFieldDecorator('errorHive')(<Input placeholder='请输入错误提示'/>)}
      </FormItem>
    </div>
  );
};

export const Hive2Form = ({ form, onOpenFile, uuids, hiveJdbc }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const jobXmlHive2 = getFieldValue('jobXmlHive2');
  const scriptPathHive2 = getFieldValue('scriptPathHive2');
  return (
    <div>
      <FormItem label='名称' {...formItemLayout}>
        {getFieldDecorator('nameHive2', {
          rules: [{ required: true, message: '请输入节点名称' }, { validator: checkNodeName }],
        })(<Input placeholder='请输入节点名称'/>)}
      </FormItem>
      <FormItem label='执行方式' {...formItemLayout}>
        {getFieldDecorator('jdbcTypeHive2', { rules: [{ required: true, message: '请选择执行方式' }], initialValue: 'hive'})
        (<RadioGroup>
            <Radio key='hive' value='hive'>hive</Radio>
            <Radio key='impala' value='impala'>impala</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem label='hive脚本路径' {...formItemLayout}>
        {getFieldDecorator('scriptPathHive2', {
          rules: [{ required: true, message: '请选择hive脚本' }],
        })(
          <div>
            <PathSelect onClick={() => onOpenFile('scriptPathHive2', fileTypeHive)} words={scriptPathHive2 || '请选择hive脚本路径, .q后缀'}/>
          </div>
        )}
      </FormItem>
      {/** //-- 切换为 radio
      <FormItem label='jdbc地址' {...formItemLayout}>
        {getFieldDecorator('jdbcUrlHive2', {
          rules: [{ required: true, message: '请输入jdbc地址' }], initialValue: hiveJdbc,
        })(<Input placeholder='请输入jdbc地址'/>)}
      </FormItem>
      <FormItem label='密码' {...formItemLayout}>
        {getFieldDecorator('passwordHive2', {
          rules: [{ message: '请输入密码' }]
        })(<Input placeholder='请输入密码'/>)}
      </FormItem>
      <FormItem label='xml文件路径' {...formItemLayout}>
        {getFieldDecorator('jobXmlHive2')(
          <div>
            <PathSelect onClick={() => onOpenFile('jobXmlHive2', fileTypeXml)} words={jobXmlHive2 || '请选择xml文件路径'}/>
          </div>
        )}
      </FormItem>
      <FormItem label='错误提示' {...formItemLayout}>
        {getFieldDecorator('errorHive')(<Input placeholder='请输入错误提示'/>)}
      </FormItem>
      */}
      <MutiInput name='参数组' keywords='paramHive2' uuid={uuids.keysparamHive2} form={form}/>
    </div>
  );
};

export const SparkForm = ({ form, onOpenFile, uuids, spark }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const jobXmlSpark = getFieldValue('jobXmlSpark');
  return (
    <div>
      <FormItem label='名称' {...formItemLayout}>
        {getFieldDecorator('nameSpark', {
          rules: [{ required: true, message: '请输入节点名称' }, { validator: checkNodeName }],
        })(<Input placeholder='请输入节点名称'/>)}
      </FormItem>
      <FormItem label='xml文件路径' {...formItemLayout}>
        {getFieldDecorator('jobXmlSpark', {
          rules: [{ required: true, message: '请选择xml文件' }],
        })(
          <div>
            <PathSelect onClick={() => onOpenFile('jobXmlSpark', fileTypeXml)} words={jobXmlSpark || '请选择xml文件路径'}/>
          </div>
        )}
      </FormItem>
      <FormItem label='master地址' {...formItemLayout}>
        {getFieldDecorator('masterSpark', {
          rules: [{ required: true, message: '请输入master地址' }], initialValue: spark,
        })(<Input placeholder='请输入master地址'/>)}
      </FormItem>
      <FormItem label='任务名称' {...formItemLayout}>
        {getFieldDecorator('sparkJobNameSpark')(<Input placeholder='spark任务名称'/>)}
      </FormItem>
      <FormItem label='运行模式' {...formItemLayout}>
        {getFieldDecorator('modeSpark', {
          rules: [{ required: true, message: '请选择运行模式' }], initialValue: 'client',
        })(
          <RadioGroup >
            <Radio key='client' value='client'>client</Radio>
            <Radio key='cluster' value='cluster'>cluster</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem label='main方法类' {...formItemLayout}>
        {getFieldDecorator('mainClassSpark')(<Input placeholder='请输入main方法类'/>)}
      </FormItem>
      <FormItem label='spark参数' {...formItemLayout}>
        {getFieldDecorator('sparkOptsSpark')(<Input placeholder='请输入spark参数'/>)}
      </FormItem>
      <MutiInput name='参数组' keywords='argsSpark' mutiType='list' uuid={uuids.keysargsSpark} form={form}/>
      <MutiInput name='jar包组' keywords='jarsSpark' onOpenFile={onOpenFile} fileType={fileTypeSpark} mutiType='fileList' uuid={uuids.keysjarsSpark} form={form}/>
      <FormItem label='错误提示' {...formItemLayout}>
        {getFieldDecorator('errorSpark')(<Input placeholder='请输入错误提示'/>)}
      </FormItem>
    </div>
  );
};


export const EmailForm = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <div>
      <FormItem label='名称' {...formItemLayout}>
        {getFieldDecorator('nameEmail', {
          rules: [{ required: true, message: '请输入节点名称' }, { validator: checkNodeName }],
        })(<Input placeholder='请输入节点名称'/>)}
      </FormItem>
      <FormItem label='主题' {...formItemLayout}>
        {getFieldDecorator('subjectEmail', {
          rules: [{ required: true, message: '请输入主题' }],
        })(<Input placeholder='请输入主题'/>)}
      </FormItem>
      <FormItem label='内容' {...formItemLayout}>
        {getFieldDecorator('bodyEmail', {
          rules: [{ required: true, message: '请输入内容' }],
        })(<Input placeholder='请输入内容'/>)}
      </FormItem>
      <FormItem label='收件人邮箱' {...formItemLayout}>
        {getFieldDecorator('toEmail', {
          rules: [{ required: true, message: '请输入收件人邮箱' }],
        })(<Input placeholder='请输入收件人邮箱'/>)}
      </FormItem>
      <FormItem label='抄送人邮箱' {...formItemLayout}>
        {getFieldDecorator('ccEmail', {
          rules: [{ required: true, message: '请输入收件人邮箱' }],
        })(<Input placeholder='请输入抄送人邮箱'/>)}
      </FormItem>
      <FormItem label='文本类型' {...formItemLayout}>
        {getFieldDecorator('contentTypeEmail', {
          rules: [{ required: true, message: '请输入文本类型' }],
          initialValue: 'text/html;charset=UTF-8',
        })(<Input placeholder='请输入文本类型'/>)}
      </FormItem>
      <FormItem label='错误提示' {...formItemLayout}>
        {getFieldDecorator('errorEmail')(
          <Input placeholder='请输入错误提示'/>
        )}
      </FormItem>
    </div>
  );
};

const protocolList = [
  { key: 'webservice' },
  { key: 'ftp' },
  { key: 'restful' },
  { key: 'http' },
  { key: 'https' },
  { key: 'ssh' },
];
const extraWebservice = [
  { label: 'ws请求体', name: 'requestBodyRemoteSync', initialValue: '' },
  { label: 'ws调用方法', name: 'methodRemoteSync', initialValue: '' },
  { label: 'ws命名空间', name: 'namespaceRemoteSync', initialValue: 'http://ws.apache.org/axis2' },
  { label: '返回结果字段', name: 'resultKeysRemoteSync', initialValue: '' },
];
const extraFtpOrSSH = [
  { label: '服务器地址', name: 'hostRemoteSync', initialValue: '' },
  { label: '端口', name: 'portRemoteSync', initialValue: '' },
  { label: '服务器登录名', name: 'usernameRemoteSync', initialValue: 'http://ws.apache.org/axis2' },
  { label: '服务器密码', name: 'passwordRemoteSync', initialValue: '' },
];
const extraRestFul = [
  { label: '返回结果字段', name: 'resultKeysRemoteSync', initialValue: '' },
  { label: '请求体', name: 'requestBodyRemoteSync', initialValue: '' },
];
const encryptTypeList = ['des', 'gpg'];
const renderSync = ({ getFieldDecorator, protocolRemoteSync }) => {
  const list = [];
  if (protocolRemoteSync === 'webservice') {
    extraWebservice.forEach((info) => {
      list.push(<RenderFormItem key={info.name} getFieldDecorator={getFieldDecorator} {...info}/>);
    });
  } else if (protocolRemoteSync === 'ftp' || protocolRemoteSync === 'ssh') {
    extraFtpOrSSH.forEach((info) => {
      list.push(<RenderFormItem key={info.name} getFieldDecorator={getFieldDecorator} {...info}/>);
    });
  } else if (protocolRemoteSync === 'restful') {
    extraRestFul.forEach((info) => {
      list.push(<RenderFormItem key={info.name} getFieldDecorator={getFieldDecorator} {...info}/>);
    });
  }
  return list;
};
const RenderFormItem = ({ getFieldDecorator, label, name, initialValue, message = '' }) => {
  const defaultMessage = `请输入${label}`;
  return (
    <FormItem label={label} {...formItemLayout}>
      {getFieldDecorator(name, {
        rules: [{ required: true, message: message || defaultMessage }],
        initialValue,
      })(<Input placeholder={message || defaultMessage}/>)}
    </FormItem>
  );
};

export const RemoteSyncForm = ({ form, searchHiveDatabase, ...other }) => {
  const { getFieldDecorator, getFieldValue } = form;
  const tempId = (new Date()).valueOf();
  const { hiveDatabase } = other;
  const protocolRemoteSync = getFieldValue('protocolRemoteSync');
  return (
    <div id={tempId}>
      <FormItem label='名称' {...formItemLayout}>
        {getFieldDecorator('nameRemoteSync', {
          rules: [{ required: true, message: '请输入节点名称' }, { validator: checkNodeName }],
        })(<Input placeholder='请输入节点名称'/>)}
      </FormItem>
      <FormItem label='协议' {...formItemLayout}>
        {getFieldDecorator('protocolRemoteSync', {
          rules: [{ required: true, message: '请输入协议' }],
        })(
          <Select placeholder='请输入协议名称' style={{ width: '100%' }}>
            {protocolList.map(({ key }) => {
              return <Option key={key}>{key}</Option>;
            })}
          </Select>
        )}
      </FormItem>
      {renderSync({ getFieldDecorator, protocolRemoteSync })}
      <FormItem label='hive数据库' {...formItemLayout}>
        {getFieldDecorator('hiveDatabaseRemoteSync')(<Select onFocus={searchHiveDatabase} placeholder='请选择hive数据库' style={{ width: '100%' }} getPopupContainer={() => document.getElementById(tempId)}>
          {hiveDatabase.map((item) => {
            return <Option key={item.name} value={item.name}>{item.name}</Option>;
          })}
        </Select>)}
      </FormItem>
      <FormItem label='导入的表' {...formItemLayout}>
        {getFieldDecorator('hiveTableRemoteSync', {
          rules: [{ required: true, message: '请输入要导入的表' }, { validator: checkTableName }],
        })(<Input placeholder='请输入要导入的表'/>)}
      </FormItem>
      <FormItem label='文件类型' {...formItemLayout}>
        {getFieldDecorator('fileTypeRemoteSync', {
          rules: [{ required: true, message: '请输入协议' }],
          initialValue: fileTypeRemoteSync[0],
        })(
          <Select placeholder='请选择文件类型' style={{ width: '100%' }}>
            {fileTypeRemoteSync.map((fileTpe) => {
              return <Option key={fileTpe}>{fileTpe}</Option>;
            })}
          </Select>
        )}
      </FormItem>
      <FormItem label='文件名称' {...formItemLayout}>
        {getFieldDecorator('fileNameRemoteSync', {
          rules: [{ required: true, message: '请输入文件名称' }],
        })(<Input placeholder='请输入文件名称'/>)}
      </FormItem>
      <FormItem label='文件路径' {...formItemLayout}>
        {getFieldDecorator('remotePathRemoteSync', {
          rules: [{ required: true, message: '请输入文件' }],
        })(<Input placeholder='请输入文件'/>)}
      </FormItem>
      <FormItem label='分区时间' {...formItemLayout}>
        {getFieldDecorator('ptDateRemoteSync', {
          rules: [{ required: true, message: '请输入分区时间' }],
        })(<Input placeholder='请输入分区时间'/>)}
      </FormItem>

      <FormItem label='HDFS地址' {...formItemLayout}>
        {getFieldDecorator('hdfsUrlRemoteSync')(<Input placeholder='请输入HDFS地址'/>)}
      </FormItem>
      <FormItem label='hive连接地址' {...formItemLayout}>
        {getFieldDecorator('hiveUrlRemoteSync')(<Input placeholder='请输入文件hive连接地址'/>)}
      </FormItem>
      <FormItem label='备份地址' {...formItemLayout}>
        {getFieldDecorator('backupRemoteSync')(<Input placeholder='请输入备份地址'/>)}
      </FormItem>
      <FormItem label='加密类型' {...formItemLayout}>
        {getFieldDecorator('encryptTypeRemoteSync')(
          <Select placeholder='请选择文件加密类型' style={{ width: '100%' }}>
            {encryptTypeList.map((encryptType) => {
              return <Option key={encryptType}>{encryptType}</Option>;
            })}
          </Select>
        )}
      </FormItem>
      <FormItem label='解密Key' {...formItemLayout}>
        {getFieldDecorator('decryptKeyRemoteSync')(<Input placeholder='请输入解密使用的Key'/>)}
      </FormItem>
      <FormItem label='Excel密码' {...formItemLayout}>
        {getFieldDecorator('excelPwdRemoteSync')(<Input placeholder='请输入Excel密码'/>)}
      </FormItem>
      <FormItem label='数据分割库' {...formItemLayout}>
        {getFieldDecorator('splitRemoteSync')(<Input placeholder='默认 ,'/>)}
      </FormItem>
      <FormItem label='字段名称列表' {...formItemLayout}>
        {getFieldDecorator('columnsRemoteSync')(<Input placeholder='如 a,b,c'/>)}
      </FormItem>
      <FormItem label='字段备注列表' {...formItemLayout}>
        {getFieldDecorator('commentsRemoteSync')(<Input placeholder='如 a,b,c'/>)}
      </FormItem>
      <FormItem label='忽略几行表头' {...formItemLayout}>
        {getFieldDecorator('ignoreLineRemoteSync')(<Input placeholder='默认0'/>)}
      </FormItem>

      <FormItem label='错误提示' {...formItemLayout}>
        {getFieldDecorator('errorRemoteSync')(<Input placeholder='请输入错误提示'/>)}
      </FormItem>
    </div>
  );
};

export const ViewValidateForm = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <div>
      <FormItem label='节点名称' {...formItemLayout}>
        {getFieldDecorator('nameViewValidate', {
          rules: [{ required: true, message: '请输入节点名称' }],
        })(<Input placeholder='请输入节点名称' />)}
      </FormItem>
      <FormItem label='hive-url' {...formItemLayout}>
        {getFieldDecorator('hiveUrlViewValidate', {
          rules: [{ required: true, message: '请输入hive－url' }],
        })(<Input placeholder='请输入hive－url' />)}
      </FormItem>
      <FormItem label='表名' {...formItemLayout}>
        {getFieldDecorator('tableViewValidate', {
          rules: [{ required: true, message: '请输入表名' }],
        })(<Input placeholder='请输入表名' />)}
      </FormItem>
      <FormItem label='分区键' {...formItemLayout}>
        {getFieldDecorator('partitionKeyViewValidate')(<Input placeholder='请输入分区键' />)}
      </FormItem>
      <FormItem label='分区值' {...formItemLayout}>
        {getFieldDecorator('partitionValueViewValidate')(<Input placeholder='请输入分区值' />)}
      </FormItem>
      <FormItem label='操作' {...formItemLayout}>
        {getFieldDecorator('operationViewValidate', {
          rules: [{ required: true, message: '请输入操作' }],
        })(<Input placeholder='请输入操作' />)}
      </FormItem>
      <FormItem label='SQL语句' {...formItemLayout}>
        {getFieldDecorator('sqlViewValidate')(<Input placeholder='请输入SQL语句' />)}
      </FormItem>
    </div>
  );
};

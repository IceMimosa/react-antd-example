const spacePattern = /\s/; // 不含空格
const namePattern = /^[a-zA-Z_][\-_a-zA-Z0-9]{1,24}$/; // 名称格式
const tableNamePattern = /^(s_)+/; // 以 s_ 开头

// 校验节点名称
export const checkNodeName = (rule, value, callback) => {
  if (value && spacePattern.test(value)) {
    callback('不能含有空格');
  } else if (value && !namePattern.test(value)) {
    callback('名称为字母、数字、下划线,长度不超过25,且首字母只能为字母或者下划线');
  } else {
    callback()
  }
}

// 校验表名
export const checkTableName = (rule, value, callback) => {
  if (value && !tableNamePattern.test(value)) {
    callback('表名必须以 s_ 开头');
  } else {
    callback()
  }
}

export const compTab = {
  source: [
    { title: '数据源管理', name: 'manage' },
    { title: '标签管理', name: 'tag' }
  ],
  analysis: [
    { title: '快速查询', name: 'edit' },
    { title: '我的查询', name: 'my' },
    // { title: '保存查询', name: 'save' },
    // { title: '历史查询', name: 'history' },
    { title: '数据地图', name: 'map' },
    { title: '关系图谱', name: 'relationship' },
    { title: '数据质量', name: 'quality' }
  ],
  file: [
    { title: '文件管理', name: 'file' }
  ],
  task: [
    { title: '任务列表', name: 'manage' },
    { title: '任务报表', name: 'report' }
  ],
  power: [
    { title: '权限审批', name: 'manage' },
    { title: '安全等级', name: 'level' }
  ],
  operation: [
    { title: '任务管理', name: 'operation-manage' },
  ],
};

export const generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return uuid;
};

export const clickable = (element) => {
  if (!element) {
    return;
  }
  if (/msie/i.test(navigator.userAgent)) {
    element.click();
  } else {
    let evt = new MouseEvent('click', {
      cancelable: true,
      bubble: true,
      view: window
    });
    element.dispatchEvent(evt);
  }
};

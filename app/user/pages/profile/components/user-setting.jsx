import UserSettingBasic from '../containers/user-setting-basic';
import UserSettingOrg from '../containers/user-setting-org';
import UserSettingOpenAPI from '../containers/user-setting-openAPI';
import { Panel } from 'common';

import './user-setting.scss';

const UserSetting = () => {
  if (document.querySelector('.ant-menu-item-selected')) {
    const obj = document.querySelector('.ant-menu-item-selected');
    const reg = new RegExp('(\\s|^)' + 'ant-menu-item-selected' + '(\\s|$)');
    obj.className = obj.className.replace(reg, ' ');
  }
  return (
    <div className='user-setting'>
      <Panel title='基础信息'>
        <UserSettingBasic/>
      </Panel>
      <Panel title='企业信息'>
        <UserSettingOrg/>
      </Panel>
      <Panel title='OpenAPI'>
        <UserSettingOpenAPI/>
      </Panel>
    </div>
  );
};

export default UserSetting;

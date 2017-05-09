import * as React from 'react';
import { Form, Button, Modal } from 'antd';
import { TopTabs } from 'common';
import { notify, compTab } from 'common/utils';

import './user-setting-org.scss';

const FormItem = Form.Item;

class UserSettingOrg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div className='user-setting-org'>
        用户企业相关操作...
      </div>
    );
  }
}
UserSettingOrg = Form.create()(UserSettingOrg);

class UserSettingOrgPanel extends React.Component {
  render() {
    return (
      <TopTabs projectName='用户设置' activeKey='org' tabs={compTab.info}>
        <div className='project-panel'>
          <div className='panel-title'>
            <span>企业信息</span>
          </div>
          <UserSettingOrg {...this.props}/>
        </div>
      </TopTabs>
    );
  }
}

export default UserSettingOrgPanel;

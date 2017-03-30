import * as React from 'react';
import { Form, Modal, Switch } from 'antd';
import { TopTabs } from 'common';
import { compTab } from 'common/utils';

const FormItem = Form.Item;

class UserSettingOpenAPI extends React.Component {
  onResetOpenAPI() {
    if (this.props.userProfile.openToken != null) {
      this.props.turnOffOpenAPI();
    } else {
      this.props.turnOnOpenAPI();
    }
  }

  onRefreshOpenToken() {
    const { refreshOpenToken } = this.props;
    Modal.confirm({
      title: '您是否确认要重新生成Token？',
      onOk() {
        refreshOpenToken();
      },
      onCancel() { },
    });
  }

  render() {
    const { openToken } = this.props.userProfile;

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };

    return (
      <div>
        <FormItem {...layout} label='是否启用：'>
          <Switch checked={openToken != null} onChange={:: this.onResetOpenAPI} size='small'/>
        </FormItem>
        <FormItem {...layout} label='Token: '>
          {openToken ? <span className='btn-line-rtl'>{openToken}<a onClick={:: this.onRefreshOpenToken}>重新生成</a></span>: '未启用'}
        </FormItem>
      </div>
    );
  }
}

UserSettingOpenAPI = Form.create()(UserSettingOpenAPI);

class UserSettingOpenAPIPanel extends React.Component {
  render() {
    return (
      <TopTabs projectName='用户设置' activeKey='api' tabs={compTab.info}>
        <div className='project-panel'>
          <div className='panel-title'>
            <span>OPENAPI</span>
          </div>
          <UserSettingOpenAPI {...this.props}/>
        </div>
      </TopTabs>
    );
  }
}


export default UserSettingOpenAPIPanel;

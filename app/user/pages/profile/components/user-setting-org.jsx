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
      form: false,
    };
  }

  onJoinOrgToggle() {
    this.setState({ form: !this.state.form });
  }

  onJoinOrgFormSubmit(evt) {
    evt.preventDefault();
    const { form: { validateFields }, applyOrg } = this.props;

    validateFields((err, values) => {
      if (!!err) return;
      applyOrg(values.orgId)
        .then(() => {
          this.setState({ form: false });
        });
    });
  }

  onLeaveOrgToggle() {
    const { orgId, orgName } = this.props.userProfile;
    Modal.confirm({
      title: '退出企业',
      content: `确定退出${orgName}吗？`,
      onOk: () => {
        this.props.onLeaveOrg(orgId)
        .then(() => notify('success', '已退出企业'));
      },
    });
  }

  onCancelOrgJoin(orgId) {
    const { cancelOrgApply } = this.props;
    cancelOrgApply(orgId);
  }

  render() {
    const { orgId, orgName, joinOrgStatus } = this.props.userProfile;
    const { getFieldDecorator } = this.props.form;

    const orgField = getFieldDecorator('orgId', {
      rules: [{ required: true, message: '请选择一个企业' }],
    });

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };

    return (
      <div className='user-setting-org'>
        <div className='user-org-info' style={{ display: this.state.form ? 'none' : 'block' }}>
          <FormItem {...layout} label='所属企业'>
            {orgName || '无'}
            <span className='btn-line-rtl'>
              {orgId ? <a onClick={::this.onLeaveOrgToggle}>退出</a> : null}
              <a onClick={::this.onJoinOrgToggle}>申请企业</a>
            </span>
          </FormItem>
          {joinOrgStatus
            ? (
            <FormItem {...layout} label='申请中企业'>
              {joinOrgStatus.orgName}
              <span className='btn-line-rtl'>
                <a onClick={() => this.onCancelOrgJoin(joinOrgStatus.orgId)}>取消</a>
              </span>
            </FormItem>
            )
            : null
          }
        </div>
        <Form horizontal className='user-org-form'
          style={{ display: this.state.form ? 'block' : 'none' }}
          onSubmit={::this.onJoinOrgFormSubmit}
        >
          <FormItem wrapperCol={{ span: layout.wrapperCol.span, offset: layout.labelCol.span }}>
            <div className='btn-line'>
              <Button type='primary' htmlType='submit'>确定</Button>
              <Button onClick={::this.onJoinOrgToggle}>取消</Button>
            </div>
          </FormItem>
        </Form>
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

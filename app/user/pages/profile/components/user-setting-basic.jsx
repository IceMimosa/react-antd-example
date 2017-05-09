import * as React from 'react';
import { Form, Input, Button } from 'antd';
import { ImageUpload, TopTabs } from 'common';
import { notify, compTab } from 'common/utils';

import './user-setting-basic.scss';

const FormItem = Form.Item;

class UserSettingBasic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      avatar: props.userProfile.avatar,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.props.onUpdateProfile(values)
      .then(() => {
        notify('success', '修改成功');
      });
    });
  }

  render() {
    const userProfile = this.props.userProfile;
    if (_.isEmpty(userProfile)) {
      return null;
    }

    const { getFieldDecorator } = this.props.form;

    const nickField = getFieldDecorator('nick', {
      rules: [
        { required: true, message: '请输入昵称' },
        { min: 2, message: '不能少于2位' },
        { max: 18, message: '不能超过18位' },
      ],
      initialValue: userProfile.nick,
    });

    const avatarField = getFieldDecorator('avatar', {
      initialValue: userProfile.avatar,
    });

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };
    const proLayout = {
      wrapperCol: { span: 8, offset: 8 },
    };

    return (
      <div>
        <Form className='user-setting-basic' horizontal>
          <FormItem required {...layout} label='手机'>
            <span>{userProfile.mobile}</span>
          </FormItem>

          <FormItem {...layout} label='邮箱' className='emailItem'>
            <span>{userProfile.email || '无'}</span>
          </FormItem>

          <FormItem {...layout} label='密码' className='passwdItem'>
            <span>*******</span>
          </FormItem>

          <FormItem required {...layout} label='昵称'>
            {nickField(<Input />)}
          </FormItem>

          <FormItem {...layout} label='头像'>
            {avatarField(<ImageUpload form={this.props.form} hint/>)}
          </FormItem>

          <FormItem {...proLayout}>
            <Button className='btn-save' type='primary' onClick={::this.handleSubmit}>保存</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

UserSettingBasic = Form.create()(UserSettingBasic);

class UserSettingBasicPanel extends React.Component {
  render() {
    return (
      <TopTabs projectName='用户设置' activeKey='person' tabs={compTab.info}>
        <div className='project-panel'>
          <div className='panel-title'>
            <span>个人信息</span>
          </div>
          <UserSettingBasic {...this.props}/>
        </div>
      </TopTabs>
    );
  }
}

export default UserSettingBasicPanel;

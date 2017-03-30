import { SimpleModal, SmartForm, InputBtn } from 'common';
import { Form, Input } from 'antd';
import * as React from 'react';
import { notify, regRules } from 'common/utils';

import './change-modal.scss';

class ChangePhoneForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const phoneField = getFieldDecorator('mobile', {
      rules: [
        { required: true, message: '请输入手机号' },
        regRules.mobile,
      ],
    });
    const passwordField = getFieldDecorator('password', {
      rules: [{ required: true, message: '密码必填' }],
    });

    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form horizontal className='phoneForm'>
        <Form.Item label='手机号' {...formLayout} hasFeedback>
          {phoneField(<Input placeholder='手机号' type='tel' />)}
        </Form.Item>
        <Form.Item required label='验证码' className='verificationForm' {...formLayout}>
          <InputBtn form={this.props.form} onSendVerfiCode={this.props.onSendVerfiCode}/>
        </Form.Item>
        <Form.Item label='密码' {...formLayout}>
          {passwordField(<Input placeholder='密码' type='password'/>)}
        </Form.Item>
      </Form>
    );
  }
}

ChangePhoneForm = Form.create()(SmartForm.beSmart()(ChangePhoneForm));

const ChangePhoneModal = SimpleModal.create({
  title: '修改手机号码',
  className: 'change-phone-modal',
  autoHide: false,
  onOk(form, modal) {
    const { validateFields, resetFields } = form.getForm();
    const { onChangePhone, onGetCurrentUserInfo } = modal.props;
    validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      modal.setState({
        confirmLoading: true,
      });
      onChangePhone(values)
        .then(() => {
          modal.hide();
          notify('success', '修改成功');
          onGetCurrentUserInfo();
          resetFields();
        }, () => { return; });
    });
  },
  onCancel(form, modal) {
    const { resetFields } = form.getForm();
    modal.hide();
    resetFields();
  },
})(ChangePhoneForm);

export default ChangePhoneModal;

import { Form, Input } from 'antd';
import { SimpleModal } from 'common';
import * as React from 'react';
import { notify } from 'common/utils';

class UserAddModalForm extends React.Component {
  checkMobile(rule, value, callback) {
    if (/^1[\d]{10}$/.test(value)) {
      callback();
    } else {
      callback('请输入正确的手机号码');
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const mobileField = getFieldDecorator('mobile', {
      rules: [
        { required: true, message: '请正确填写用户手机号码' },
        { validator: this.checkMobile.bind(this) },
      ],
    });

    const nickField = getFieldDecorator('nick', {
      rules: [
        { required: true, message: '请填写昵称' },
        { max: 20, message: '不能超过20位' },
      ],
    });

    // TODO 密码应该提供初始化,而不是设置
    const passwordField = getFieldDecorator('password', {
      rules: [
        { required: true, min: 8, message: '请填写用户初始化密码, 至少为8位' },
      ],
    });
    const orgField = getFieldDecorator('orgId');
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form horizontal>
        <Form.Item {...layout} label='手机号码'>
          {mobileField(<Input placeholder='输入用户手机号码'/>)}
        </Form.Item>
        <Form.Item l{...layout} label='昵称'>
          {nickField(<Input placeholder='输入昵称'/>)}
        </Form.Item>
        <Form.Item {...layout} label='初始化密码'>
          {passwordField(<Input placeholder='输入用户初始化密码'/>)}
        </Form.Item>
      </Form>
    );
  }
}

UserAddModalForm = Form.create({})(UserAddModalForm);

const UserAddModal = SimpleModal.create({
  title: '新建用户',
  autoHide: false,
  onOk(form, modal) {
    const { validateFields, resetFields } = form.getForm();
    validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      modal.setState({ confirmLoading: true });
      modal.props.onSave(values)
        .then(() => {
          modal.hide();
          notify('success', '添加成功');
          resetFields();
        });
    });
  },
  onCancel(form, modal) {
    const { resetFields } = form.getForm();
    modal.hide();
    resetFields();
  },
})(UserAddModalForm);

export default UserAddModal;

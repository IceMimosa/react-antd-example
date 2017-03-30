import { Form, Input } from 'antd';
import * as React from 'react';
import { SimpleModal } from 'common';
import { notify } from 'common/utils';

class UserResetPasswordModalForm extends React.Component {
  render() {
    const passwordField = this.props.form.getFieldDecorator('password', {
      rules: [
        { required: true, min: 8, message: '请填写用户重置后密码, 至少为8位' },
      ],
    });
    return (
      <Form horizontal>
        <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label='重置密码：'>
          {passwordField(<Input placeholder='输入用户重置后密码'/>)}
        </Form.Item>
      </Form>
    );
  }
}

UserResetPasswordModalForm = Form.create({})(UserResetPasswordModalForm);

const UserResetPasswordModal = SimpleModal.create({
  title: '重置密码',
  autoHide: false,
  onOk(form, modal) {
    const { validateFields, resetFields } = form.getForm();
    validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      modal.setState({ confirmLoading: true });
      modal.props.onResetPassword(modal.state.user.id, values.password)
        .then(() => {
          modal.hide();
          notify('success', '重置成功');
          resetFields();
        });
    });
  },
  onCancel(form, modal) {
    const { resetFields } = form.getForm();
    modal.hide();
    resetFields();
  },
  onShow(form, modal, user) {
    modal.setState({ user });
  },
})(UserResetPasswordModalForm);

export default UserResetPasswordModal;

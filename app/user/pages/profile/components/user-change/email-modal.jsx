import { SimpleModal } from 'common';
import { Form, Input } from 'antd';
import { notify } from 'common/utils';

let ChangeEmailForm = ({ form }) => {
  const { getFieldDecorator } = form;
  const emailField = getFieldDecorator('email', {
    validate: [{
      rules: [{ required: true, message: '邮箱必填' }],
      trigger: 'onBlur',
    }, {
      rules: [
          { type: 'email', message: '请输入正确的邮箱地址' },
      ],
      trigger: ['onBlur', 'onChange'],
    }],
  });
  const passwordField = getFieldDecorator('password', {
    rules: [{ required: true, message: '密码必填' }],
  });
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <Form horizontal className='form'>
      <Form.Item {...formLayout} label='邮箱'>
        {emailField(<Input placeholder='邮箱'/>)}
      </Form.Item>
      <Form.Item {...formLayout} label='密码'>
        {passwordField(<Input placeholder='密码' type='password'/>)}
      </Form.Item>
    </Form>
  );
};

ChangeEmailForm = Form.create()(ChangeEmailForm);

const ChangeEmailModal = SimpleModal.create({
  title: '修改邮箱',
  className: 'change-email-modal',
  autoHide: false,
  onOk(form, modal) {
    const { validateFields, resetFields } = form.getForm();
    const { onChangeEmail, onGetCurrentUserInfo } = modal.props;
    validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      modal.setState({
        confirmLoading: true,
      });
      modal.loading(true);
      onChangeEmail(values)
        .then(() => {
          modal.hide();
          modal.loading(false);
          notify('success', '邮件已发送');
          onGetCurrentUserInfo();
          resetFields();
        }, () => modal.loading(false));
    });
  },
  onCancel(form, modal) {
    const { resetFields } = form.getForm();
    modal.hide();
    resetFields();
  },
})(ChangeEmailForm);

export default ChangeEmailModal;

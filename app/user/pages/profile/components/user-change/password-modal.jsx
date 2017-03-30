import { SimpleModal } from 'common';
import { Form, Input } from 'antd';
import { notify } from 'common/utils';



let ChangePasswordForm = ({ form }) => {
  const { getFieldDecorator } = form;

  const checkPass = (rule, value, callback) => {
    const { validateFields } = form;
    if (value) {
      validateFields(['rePasswd'], { force: true });
      if (value.length < 6) callback('密码长度不能小于6位');
      if (value.length > 18) callback('密码长度不能超过18位');
    }
    callback();
  };

  const checkPass2 = (rule, value, callback) => {
    const { getFieldValue } = form;
    if (value && value !== getFieldValue('passwd')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  };

  const oldPasswordField = getFieldDecorator('oldpasswd', {
    rules: [{ required: true, message: '旧密码必填' }],
  });
  const newPasswordField = getFieldDecorator('passwd', {
    rules: [
      { required: true, message: '新密码必填' },
      { validator: checkPass },
    ],
  });
  const cerPasswordField = getFieldDecorator('rePasswd', {
    rules: [
      { required: true, message: '确认密码' },
      { validator: checkPass2 },
    ],
  });
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <Form horizontal className='form'>
      <Form.Item {...formLayout} label='旧密码'>
        {oldPasswordField(<Input placeholder='旧密码' type='password'/>)}
      </Form.Item>
      <Form.Item {...formLayout} label='新密码'>
        {newPasswordField(<Input placeholder='新密码' type='password'/>)}
      </Form.Item>
      <Form.Item {...formLayout} label='确认密码'>
        {cerPasswordField(<Input placeholder='确认密码' type='password'/>)}
      </Form.Item>
    </Form>
  );
};

ChangePasswordForm = Form.create()(ChangePasswordForm);

const ChangePasswordModal = SimpleModal.create({
  title: '修改密码',
  className: 'change-password-modal',
  autoHide: false,
  onOk(form, modal) {
    const { validateFields } = form.getForm();
    const { onChangePassword, onLogout } = modal.props;
    validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      modal.setState({
        confirmLoading: true,
      });
      const passwds = {
        currentPassword: values.oldpasswd,
        password: values.passwd,
      };
      onChangePassword(passwds)
        .then(() => {
          modal.hide();
          notify('success', '修改成功');
          onLogout();
        }, () => {return; });
    });
  },
  onCancel(form, modal) {
    const { resetFields } = form.getForm();
    modal.hide();
    resetFields();
  },
})(ChangePasswordForm);

export default ChangePasswordModal;

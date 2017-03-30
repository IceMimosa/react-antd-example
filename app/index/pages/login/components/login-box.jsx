import { Form, Input, Icon, message } from 'antd';
import { Icon as CustomIcon } from 'common';
import { Link } from 'react-router';
import * as React from 'react';
const FormItem = Form.Item;
import './login-box.scss';

const loginFields = {
  terminus: {
    desc: '手机号',
    icon: 'phone',
  },
};

let LoginForm = ({ enterLogin, form }) => {
  const { getFieldDecorator } = form;
  const fieldMeta =loginFields[window._profile_] ||loginFields.terminus;

  return (
    <Form horizontal className='login-form'>
      <div className='login-form-item'>
        <CustomIcon type={fieldMeta.icon} className='item-icon'/>
        <FormItem className='item-input-wrap'>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: `请输入${fieldMeta.desc}` }],
          })(<Input type='text' size='default' className='item-input'  placeholder={`输入${fieldMeta.desc}`} onPressEnter={enterLogin}/>)}
        </FormItem>
      </div>
      <div className='login-form-item-separater' />
      <div className='login-form-item'>
        <CustomIcon type='lock' className='item-icon'/>
        <FormItem className='item-input-wrap'>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })( <Input type='password' size='default' className='item-input'  placeholder='输入密码' onPressEnter={enterLogin}/>)}
        </FormItem>
      </div>
    </Form>
  );
};

LoginForm = Form.create()(LoginForm);

class LoginBox extends React.Component {

  onLoginClick() {
    const { onLoginSubmit } = this.props;
    this.refs.form.validateFields((err, values) => {
      if (!!err) return;
      onLoginSubmit(values);
    });
  }

  render() {
    const { loginUser, onLogout } = this.props;
    if (!_.isEmpty(loginUser)) {
      return (
        <div className='login-box'>
          <div className='login-title'>
            欢迎回来
          </div>
          <div className='login-info'>
            <div className='login-user-nick'>{_.isEmpty(loginUser.nick) ? loginUser.email : loginUser.nick}</div>
            <a className='logout-link' onClick={onLogout}><Icon type='logout'/> 登出</a>
          </div>
          <Link to='/console' className='submit-link'>进入控制台</Link>
        </div>
      );
    }

    return (
      <div className='login-box'>
        <div className='login-title'>
          登录
          <a className='login-title-link' onClick={() => { message.warning('暂未开放'); }}>注册</a>
        </div>
        <LoginForm ref='form' enterLogin={::this.onLoginClick}/>
        <a className='submit-link' onClick={::this.onLoginClick}>立即登录</a>
      </div>
    );
  }
}

export default LoginBox;

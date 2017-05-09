import * as React from 'react';
import { Form, Input, Tabs, Button } from 'antd';
import { Icon as CustomIcon } from 'common';
import './login-box.scss';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const loginFields = {
  phone: {
    desc: '手机号',
    icon: 'phone',
  },
  user: {
    desc: '用户名',
    icon: 'yonghuming',
  },
};

let LoginForm = ({ enterLogin, form, loginType }) => {
  const { getFieldDecorator } = form;
  const fieldMeta = loginFields[loginType];

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
      <div className='login-form-item'>
        <CustomIcon type='mima' className='item-icon'/>
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
  state={
    loginType: 'phone',
  };
  onLoginClick() {
    const { onLoginSubmit } = this.props;
    this.refs.form.validateFields((err, values) => {
      if (!!err) return;
      onLoginSubmit(values);
    });
  }
  changeLogin(key) {
    this.setState({ loginType: key });
  }
  render() {
    const { loginType } = this.state;
    return (
      <div className='login-box'>
        <Tabs defaultActiveKey='phone' onChange={::this.changeLogin}>
          <TabPane tab='手机账号登录' key='phone'></TabPane>
          <TabPane tab='网站账号登录' key='user'></TabPane>
        </Tabs>
        <LoginForm ref='form' enterLogin={::this.onLoginClick} loginType={loginType}/>
        <Button className='login-button' onClick={::this.onLoginClick}>登录</Button>
        {/*<Button className='register-button' onClick={::this.onLoginClick}>创建我的Abstergo账号</Button>*/ }
      </div>
    );
  }
}

export default LoginBox;

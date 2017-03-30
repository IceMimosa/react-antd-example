import * as React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router';
import { regRules } from 'common/utils';
import { Icon as CustomIcon, ImageUpload, InputBtn } from 'common';

import './register-form.scss';

const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 8 },
};
const btnLayout = {
  wrapperCol: { span: 8, offset: 9 },
};
class RegisterAccount extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      passwdStrong: 0,
    };
  }

  render() {
    const { form, nextStep } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const checkPass = (rule, value, callback) => {
      const { validateFields } = form;
      let count = 0;
      if (value) {
        validateFields(['rePasswd'], { force: true });
        if (value.match(/\d+/)) count++;
        if (value.match(/[a-z,A-Z]+/)) count++;
        if (value.match(/[~!@#\$%^&*\(\)\{\};,.\?\/'"]/)) count++;
      }
      this.setState({ passwdStrong: count });
      callback();
    };

    const checkPass2 = (rule, value, callback) => {
      if (value && value !== getFieldValue('password')) {
        callback('两次输入密码不一致！');
      } else {
        callback();
      }
    };

    const mobileField = getFieldDecorator('mobile', {
      rules: [
        { required: true, message: '请输入手机号' },
        regRules.mobile,
      ],
    });
    const emailField = getFieldDecorator('email', {
      rules: [{ required: true, message: 'Email必填' }, { type: 'email', message: '请填写正确邮箱' }],
    });
    const nickField = getFieldDecorator('nick', {
      rules: [
        { min: 2, message: '不能少于2位' },
        { max: 18, message: '不能超过18位' },
      ],
    });
    const passwdField = getFieldDecorator('password', {
      rules: [
        { required: true, message: '新密码必填' },
        { validator: checkPass },
        { min: 6, message: '不能少于6位' },
        { max: 18, message: '不能超过18位' },
      ],
    });
    const rePasswordField = getFieldDecorator('rePasswd', {
      rules: [
        { required: true, message: '确认密码' },
        { validator: checkPass2 },
      ],
    });
    const { passwdStrong } = this.state;
    return (
      <div className='account'>
        <Form className='account-form' horizontal>
          <FormItem required {...formLayout} label='手机号'>
            {mobileField(<Input />)}
          </FormItem>
          <FormItem required {...formLayout} label='验证码'>
            <InputBtn form={form} onSendVerfiCode={this.props.onSendVerfiCode}/>
          </FormItem>
          <FormItem required {...formLayout} label='Email'>
            {emailField(<Input />)}
          </FormItem>
          <FormItem {...formLayout} label='昵称'>
            {nickField(<Input />)}
          </FormItem>
          <FormItem required {...formLayout} label='密码'>
            {passwdField(<Input type='password'/>)}
            <div className='passwd-test'>
              <div className={`weak ${passwdStrong === 0 ? 'inactive' : ''}`}>弱</div>
              <div className={`middle ${passwdStrong < 2 ? 'inactive' : ''}`}>中</div>
              <div className={`high ${passwdStrong === 3 ? '' : 'inactive'}`}>强</div>
            </div>
          </FormItem>
          <FormItem required {...formLayout} label='确认密码'>
            {rePasswordField(<Input type='password'/>)}
          </FormItem>
          <FormItem {...btnLayout}>
            <Button className='btn-next' onClick={nextStep}>下一步</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const RegisterAccountForm = Form.create()(RegisterAccount);

const JoinCompany = ({ form, registerCompany }) => {
  const { getFieldDecorator } = form;
  const companyField = getFieldDecorator('orgId');
  return (
    <div className='join-company'>
      <Form horizontal>
        <FormItem {...formLayout} label='公司名称' className='select-row'>
          {/*companyField(<OrgSelect placeholder='请选择' className='select-company' />)*/}
          <div className='annotation-row'>
            您可以跳过此项，但是申请加入公司才能创建项目
          </div>
        </FormItem>
        <FormItem {...btnLayout}>
          <Button className='btn-next' onClick={registerCompany}>注册</Button>
        </FormItem>
      </Form>
    </div>
  );
};

const JoinCompanyForm = Form.create()(JoinCompany);

const SettingCompany = ({ form, createCompany }) => {
  const { getFieldDecorator } = form;
  const nameField = getFieldDecorator('companyName', {
    rules: [{ required: true, message: '请填写用户名称' }],
  });
  const descField = getFieldDecorator('name', {
    rules: [{ required: true, message: '请填写用户简称' }],
  });
  const codeField = getFieldDecorator('socialCreditCode');
  const addressField = getFieldDecorator('address');
  const telField = getFieldDecorator('tel');
  const bankField = getFieldDecorator('bank');
  const accountField = getFieldDecorator('bankAccount');
  const licenseField = getFieldDecorator('license');
  const certField = getFieldDecorator('texRegisterCert');
  return (
    <div className='company-setting-form'>
      <Form horizontal>
        <FormItem {...formLayout} label='公司名称'>
          {nameField(<Input />)}
        </FormItem>
        <FormItem {...formLayout} label='公司简称'>
          {descField(<Input />)}
        </FormItem>
        <FormItem {...formLayout} label='统一社会信用代码'>
          {codeField(<Input />)}
        </FormItem>
        <FormItem {...formLayout} label='注册地址'>
          {addressField(<Input />)}
        </FormItem>
        <FormItem {...formLayout} label='注册电话'>
          {telField(<Input />)}
        </FormItem>
        <FormItem {...formLayout} label='开户银行'>
          {bankField(<Input />)}
        </FormItem>
        <FormItem {...formLayout} label='银行账号'>
          {accountField(<Input />)}
        </FormItem>
        <FormItem {...formLayout} label='营业执照'>
          {licenseField(<ImageUpload form={form} />)}
        </FormItem>
        <FormItem {...formLayout} label='税务登记证'>
          {certField(<ImageUpload form={form} />)}
        </FormItem>
        <FormItem {...btnLayout}>
          <Button className='btn-next' onClick={createCompany}>注册</Button>
        </FormItem>
      </Form>
    </div>
  );
};

const SettingCompanyForm = Form.create()(SettingCompany);


const ApplySuccess = ({ result }) => {
  return (
    <div className='register-finish'>
      <div className='icon-border'>
        <CustomIcon className='icon-success' type='gongsizhuce01'/>
      </div>
      <div>
        <div className='title'>注册成功！</div>
        {
          result === 1 ? <div className='redirect'>请耐心等待公司审核，成功加入公司后即可开始创建项目</div> : null
        }
        {
          result === 2 ? <div className='redirect'>
            请到 <Link to='/console/projects'>开发者后台</Link> > <Link to='/console/users/profile/person'>信息设置</Link> 申请加入公司才能创建项目
          </div> : null
        }
        <div className='index'>
          您可以回 <Link to='/'>首页</Link> 浏览网站
          {
            result === 2 ? '...' : (result === 1 ? ['，或者查看 ', <Link to='/console/projects'>开发者后台</Link>] : ['，或者查看 ', <Link to='/console/projects'>公司后台</Link>])
          }
        </div>
      </div>
    </div>
  );
};

export { RegisterAccountForm, JoinCompanyForm, SettingCompanyForm, ApplySuccess };

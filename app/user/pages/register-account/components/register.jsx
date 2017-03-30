import * as React from 'react';
import { Breadcrumb } from 'antd';

import { notify } from 'common/utils';
import { RegisterAccountForm, JoinCompanyForm, SettingCompanyForm, ApplySuccess } from './register-form';
import Navigator from './navigator';

import './register.scss';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      result: 1,
    };
  }

  nextStep(evt) {
    const { validateFields, resetFields } = this.account;
    const { onCurrentUserInfo, onRegisterAccount } = this.props;
    if (evt) {
      evt.preventDefault();
    }
    validateFields((err, values) => {
      if (!!err) return;
      onRegisterAccount(_.omit(values, ['rePasswd']))
        .then(() => {
          this.setState({ step: 2 }, () => { resetFields(); });
          notify('success', '注册成功');
          onCurrentUserInfo();
        });
    });
  }

  registerCompany(evt) {
    const { validateFields, resetFields } = this.company;
    const { onCurrentUserInfo, onRegisterOrg } = this.props;
    if (evt) {
      evt.preventDefault();
    }
    validateFields((err, values) => {
      if (!!err) return;
      if (!values.orgId) {
        this.setState({ step: 3, result: 2 });
        onCurrentUserInfo();
        return;
      }
      onRegisterOrg(values.orgId)
        .then(() => {
          this.setState({ step: 3, result: 1 }, () => { resetFields(); });
          onCurrentUserInfo();
        });
    });
  }

  createCompany(evt) {
    const { validateFields, resetFields } = this.createOrg;
    const { onCurrentUserInfo, onCreateOrg } = this.props;
    if (evt) {
      evt.preventDefault();
    }
    validateFields((err, values) => {
      if (!!err) return;
      onCreateOrg(values)
        .then(() => {
          this.setState({ step: 3, result: 3 }, () => { resetFields(); });
          onCurrentUserInfo();
        });
    });
  }

  render() {
    const { step, result } = this.state;
    const { path, title, breadcrumb, onSendVerfiCode } = this.props;
    return (
      <div className='register-div'>
        <Breadcrumb separator='>' >
          <Breadcrumb.Item>{title}注册</Breadcrumb.Item>
          <Breadcrumb.Item>
          {
            step === 1 ? '注册账号' : (step === 2 ? `${breadcrumb}` : '注册成功')
          }
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className='register-content'>
          <Navigator step={step} middleTitle={breadcrumb}/>
          {
            step === 1 ? <RegisterAccountForm ref={(ref) => { this.account = ref; }} nextStep={::this.nextStep} onSendVerfiCode={onSendVerfiCode}/> :
            (step === 2 ?
              (
                path === 'developer' ? <JoinCompanyForm ref={(ref) => { this.company = ref; }} registerCompany={::this.registerCompany}/> :
                  <SettingCompanyForm ref={(ref) => { this.createOrg = ref; }} createCompany={::this.createCompany} />
              ) : <ApplySuccess result={result}/>
            )
          }
        </div>
      </div>

    );
  }
}

export default Register;

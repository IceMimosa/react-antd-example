import * as React from 'react';
import { ImgHolder, Icon as CustomIcon } from 'common';
import { Dropdown, Menu, Badge } from 'antd';
import './person-native.scss';

class PersonNative extends React.Component {
  render() {
    const { loginUser, onLogout, onUserTypeSwitch } = this.props;
    const menu = (
      <Menu className='person-mean'>
        {
        loginUser.allowedTypes.includes('COMPANY_ADMIN') ?
          <Menu.Item>
            {
            loginUser.realType === 'COMPANY_ADMIN' ? <a onClick={() => onUserTypeSwitch('DEVELOPER')}>开发者后台</a>
            : <a onClick={() => onUserTypeSwitch('COMPANY_ADMIN')}>企业后台</a>
          }
          </Menu.Item> : null
      }
        <Menu.Item>
          <a href='/console/users/profile/person'>个人设置</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={onLogout}>登出</a>
        </Menu.Item>
      </Menu>
  );
    return (
      <div className='person-native-box'>
        <div className='person-native'>
          <div className='info'>
            <Badge>
              <a href='/console/message/USER'>
                <CustomIcon type='liuyanfill' className='message native-tab' />
              </a>
            </Badge>
          </div>
          <Dropdown overlay={menu}>
            <div className='avator'>
              <ImgHolder rect='30x30' src={loginUser.avatar}></ImgHolder>
              <i className='arrow-down'/>
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default PersonNative;

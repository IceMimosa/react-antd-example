import * as React from 'react';
import { ImgHolder, Icon as CustomIcon } from 'common';
import { Dropdown, Menu, Badge } from 'antd';
import './person-native.scss';

class PersonNative extends React.Component {
  render() {
    const { loginUser, onLogout } = this.props;
    const menu = (
      <Menu className='person-mean'>
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

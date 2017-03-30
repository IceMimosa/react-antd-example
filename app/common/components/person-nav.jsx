import * as React from 'react';
import { ImgHolder, Icon as CustomIcon } from 'common';
import { Dropdown, Menu, Badge } from 'antd';
import { Link } from 'react-router';
import './person-nav.scss';

class PersonNav extends React.Component {
  componentWillMount() {
    if (!this.props.noMessage) this.props.onMessageNotify();
  }
  render() {
    const { loginUser, onLogout, onUserTypeSwitch, noMessage } = this.props;
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
      <div className='person-nav-box'>
        <div className='person-nav'>
          <a href='http://docs.terminus.io/paas/' className='person-nav-tab-box'>
            <CustomIcon type='question' className='nav-tab'/>
          </a>
          {
            noMessage ? null :
            <div className='person-nav-tab-box'>
              <Badge dot={this.props.notify !== 0}>
                <Link to='/console/message/USER'>
                  <CustomIcon type='xinxi' className='message nav-tab' />
                </Link>
              </Badge>
            </div>
          }
          <Dropdown overlay={menu}>
            <div className='avatar'>
              <ImgHolder rect='30x30' src={loginUser.avatar} type='avatar'></ImgHolder>
              <i className='arrow-up'/>
              <i className='arrow-down'/>
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default PersonNav;

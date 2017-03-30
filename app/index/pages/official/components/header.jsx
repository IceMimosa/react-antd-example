import { Icon as CustomIcon } from 'common';
import * as React from 'react';
import { Link } from 'react-router';
import { Menu, Dropdown, Icon } from 'antd';

import './header.scss';

const Header = ({ onLogout, user, onUserTypeSwitch }) => {
  const p = window._profile_ || 'terminus';

  const logoClass = p ? `logo logo-${p}` : 'logo';

  const typeMenu = (
    <Menu>
      <Menu.Item>
        <a href='/register/org'>企业注册</a>
      </Menu.Item>
      <Menu.Item>
        <a href='/register/developer'>开发者注册</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className='official-header'>
      <div className='official-header-box clearfix'>
        <div className='logo-box'>
          <Link to='/'>
            <div className={logoClass} />
          </Link>
        </div>
        <div className='right-menu-box'>
          <div className='right-menu-navs'>
            <Link to='/'>研发体系</Link>
            <Link to='/'>产品库</Link>
            <Link to='/'>部署平台</Link>
            <Link to='/'>辅助系统</Link>
            <Link className='solution' to='/'>解决方案</Link>
            <Link to='/'>成功案例</Link>
          </div>
          <div className='right-menu-login'>
            <Dropdown overlay={typeMenu}>
              <a className='header-register'>注册 <CustomIcon type='down' /></a>
            </Dropdown>
            <a className='header-login' href='/'>登录</a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;

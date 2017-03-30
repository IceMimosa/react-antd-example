import { ImgHolder, PersonNav, Icon as CustomIcon } from 'common';
import * as React from 'react';
import { Link } from 'react-router';
import { Menu, Dropdown, Icon } from 'antd';

import './header.scss';

const Header = ({ onLogout, user, onUserTypeSwitch }) => {
  const p = window._profile_ || 'terminus';

  const logoClass = p ? `logo logo-${p}` : 'logo';

  const { avatar, nick, realType, allowedTypes } = user;

  const typeTexts = {
    DEVELOPER: '开发者后台',
    COMPANY_ADMIN: '企业后台',
    SYS_ADMIN: '系统后台',
  };

  const typeMenu = (
    <Menu>
      {
        allowedTypes.map(type => (
          <Menu.Item key={type}>
            <a onClick={() => onUserTypeSwitch(type)}>{typeTexts[type]}</a>
          </Menu.Item>
        ))
      }
    </Menu>
  );
  return (
    <div className='console-header'>
      <div className='logo-box'>
        <Link to='/'>
          <div className={logoClass}></div>
          <div className='logo-text'>{user.orgName}</div>
        </Link>
      </div>
      {
        window._profile_ === 'terminus'
        ? <a className='console-feedback' href='http://issue.terminus.io/projects/PAASISSUE/issues' target='_blank'>Feedback</a>
        : null
      }
      <div className='right-menu-box'>
        <PersonNav />
      </div>
    </div>
  );
};
export default Header;

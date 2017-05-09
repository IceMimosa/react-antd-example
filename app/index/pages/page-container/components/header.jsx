import { ImgHolder, PersonNav, Icon as CustomIcon } from 'common';
import * as React from 'react';
import { Link } from 'react-router';

import './header.scss';

const Header = ({ onLogout, user }) => {
  const p = window._profile_ || 'terminus';
  const logoClass = p ? `logo logo-${p}` : 'logo';
  return (
    <div className='console-header'>
      <div className='logo-box'>
        <Link to='/'>
          <div className={logoClass}></div>
          <div className='logo-text'>{user.orgName}</div>
        </Link>
      </div>
      <div className='right-menu-box'>
        <PersonNav />
      </div>
    </div>
  );
};
export default Header;

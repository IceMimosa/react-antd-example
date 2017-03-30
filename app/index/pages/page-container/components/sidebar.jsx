import { Menu, Icon } from 'antd';
import * as React from 'react';
import { Link } from 'react-router';

import './sidebar.scss';

const { Item: MenuItem } = Menu;

const menuMap = {
  DEVELOPER: [
    { icon: 'source', text: '数据采集', href: '/console/source/manage' },
    { icon: 'analysis', text: '数据分析', href: '/console/analysis/edit' },
    { icon: 'task', text: '任务管理', href: '/console/task/manage' },
    // { icon: 'file', text: '文件管理', href: '/console/file' },
    { icon: 'user', text: '用户数据', href: '/console/user-data' },
    { icon: 'develop', text: '数据开发', href: '/console/data-develop' },
    { icon: 'operation', text: '运营管理', href: '/console/operation-manage' },
  ],
  COMPANY_ADMIN: [
    { icon: 'user', text: '用户管理', href: '/console/orgs/members-extend' },
    { icon: 'power', text: '权限管理', href: '/console/power/manage' },
  ],
  SYS_ADMIN: [
    { icon: 'user', text: '企业用户', href: '/console/users' },
    { icon: 'user', text: '企业管理', href: '/console/orgs' },
  ],
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
    };
  }
  switchPanel() {
    if (this.state.active) {
      this.setState({ active: false });
    } else {
      this.setState({ active: true });
    }
  }
  clickFileManage(param) {
    const { reloadFileList, onReloadFileList } = this.props;
    if (param === '文件管理') {
      onReloadFileList(reloadFileList);
    }
  }
  render() {
    const { loginUser } = this.props;
    const menus = !loginUser.orgId ? [] : menuMap[loginUser.realType];
    const p = window._profile_ || 'terminus';
    const logoClass = p ? `logo logo-${p}` : 'logo';
    const flex = this.state.active
      ? { flex: '0 0 180px' }
      : { flex: '0 0 80px' };
    const logoWidth = this.state.active
      ? { width: '100px' }
      : { width: '12px' };

    return (
      <div className='console-sidebar' style={flex}>
        <div className='console-sidebar-header'>
          <div className='logo-box'>
            <Link to='/'>
              <div className={logoClass} style={logoWidth}></div>
            </Link>
            <Icon type={`${this.state.active ? 'left' : 'right'}`} className='sidebar-switch' onClick={::this.switchPanel} />
          </div>
        </div>
        <div className='console-sidebar-body'>
          <Menu className='sidebar-menu'>
            {_.filter(menus, (menu) => { return menu.icon !== 'registries' || loginUser.orgId != null; }).map(menu => {
              return (
                <MenuItem className='sidebar-menu-item' key={menu.text}>
                  <Link to={menu.href} onClick={() => this.clickFileManage(menu.text)}>
                    <i className={`sidebar-icon ${menu.icon}`}></i>
                    {
                      this.state.active
                      ? <div className='sidebar-menu-item-text'>{menu.text}</div>
                      : null
                    }
                  </Link>
                </MenuItem>
              );
            })}
          </Menu>
        </div>
      </div>
    );
  }
}

export default Sidebar;

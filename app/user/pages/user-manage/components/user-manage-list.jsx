import { ImgHolder, Icon as CustomIcon, TopTabs } from 'common';
import { Form, Input, Button, Table, Icon, Popconfirm } from 'antd';
import * as React from 'react';
import UserAddModal from './user-add';
import UserResetPasswordModal from './user-reset-password';

import './user-manage-list.scss';

class UserManageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 5
    };
  }

  componentDidMount() {
    this.props.onSearchSubmit({ pageNo: this.state.currentPage })
  }

  render() {
    const { isFetching, users = {}, onCreateUser } = this.props;
    const { list = [], total } = users;

    const columns = [
      {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        className: 'member-avatar',
        render(avatar, record) {
          return <ImgHolder className='avatar' src={avatar} rect='40x40' text={record.nick.substring(0, 1)} />;
        },
      }, {
        title: '昵称',
        dataIndex: 'nick',
        key: 'nick',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      }
    ];

    const pagination = {
      total,
      pageSize: this.state.pageSize,
      current: this.state.currentPage,
      onChange: (pageNo) => {
        const query = {
          pageNo,
        };
        this.props.onSearchSubmit(query)
          .then(() => {
            this.setState({ currentPage: pageNo });
          });
      },
    };

    return (
      <div>
        <TopTabs projectName='用户管理'/>
        <div className='user-manage-list project-panel'>
          <div className='users-flex'>
            <Button type='ghost' className='users-add-btn' onClick={() => this.refs.userAddModal.show()}>新建用户</Button>
          </div>
          <Table columns={columns} dataSource={list} loading={isFetching} rowKey='id' pagination={pagination} />
          <UserAddModal ref='userAddModal' onSave={onCreateUser} />
        </div>
      </div>
    );
  }
}

export default UserManageList;
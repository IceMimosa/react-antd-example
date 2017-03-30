import { ImgHolder, Icon as CustomIcon, TopTabs } from 'common';
import { Form, Input, Button, Table, Icon, Popconfirm } from 'antd';
import * as React from 'react';
import UserAddModal from './user-add';
import UserResetPasswordModal from './user-reset-password';

import './user-manage-list.scss';

const FormItem = Form.Item;

class UserSearchForm extends React.Component {

  onSubmit(evt) {
    evt.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }
      this.props.onSearchSubmit(values);
    });
  }

  render() {
    const queryField = this.props.form.getFieldDecorator('key', {
      rules: [
        { required: true, message: '请输入手机号或昵称搜索' },
      ],
    });
    return (
      <Form inline className='search-form' onSubmit={::this.onSubmit}>
        <FormItem label='手机号/昵称'>
          {queryField(<Input style={{ width: '300px' }} placeholder='请输入手机号或昵称' />)}
        </FormItem>
        <Button htmlType='submit' type='primary' icon='search' className='users-search-btn'>搜索</Button>
      </Form>
    );
  }
}

UserSearchForm = Form.create()(UserSearchForm);

class UserManageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    };
  }
  getOperator(t, record) { // TODO 这里密码的图标不对
    return {
      NEW: <Button type='primary' onClick={() => this.refs.userResetPasswordModal.show(record)}><Icon type='eye-o'/>重置密码</Button>,
      ACTIVE: (
        <span>
          <Popconfirm title='确定要锁定这个用户吗？' onConfirm={::this.lockUser(record)}>
            <Button className='btn' type='primary'><Icon type='lock'/>锁定</Button>
          </Popconfirm>
          <Button style={{ marginLeft: '10px' }} className='btn' type='ghost' onClick={() => this.refs.userResetPasswordModal.show(record)}><Icon type='eye-o'/>重置密码</Button>
        </span>
      ),
      LOCK: (
        <Popconfirm title='确定要解锁这个用户吗？' onConfirm={::this.unlockUser(record)}>
          <Button type='primary'><Icon type='unlock'/>解锁</Button>
        </Popconfirm>
      ),
    }[record.status];
  }

  lockUser(user) {
    return () => {
      this.props.lockUser(user)
        .then(() => this.submitSearch());
    };
  }
  unlockUser(user) {
    return () => {
      this.props.unlockUser(user)
        .then(() => this.submitSearch());
    };
  }
  submitSearch() {
    const { searchForm } = this.refs;
    return this.props.onSearchSubmit(searchForm.getFieldsValue());
  }

  render() {
    const { isFetching, users = {}, onSearchSubmit, onCreateUser, onResetPassword } = this.props;
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
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render(status) {
          return {
            NEW: '未激活',
            ACTIVE: '正常',
            LOCK: '已锁定',
          }[status];
        },
      }, {
        title: '操作',
        key: 'operator',
        render: ::this.getOperator,
      },
    ];

    const pagination = {
      total,
      current: this.state.currentPage,
      onChange: (pageNo) => {
        const query = {
          ...this.refs.searchForm.getFieldsValue(),
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
            <UserSearchForm ref='searchForm' className='searchForm' onSearchSubmit={onSearchSubmit} />
            <Button type='ghost' className='users-add-btn' onClick={() => this.refs.userAddModal.show()}>新建用户</Button>
          </div>
          <Table columns={columns} dataSource={list} loading={isFetching} rowKey='id' pagination={pagination} />
          <UserAddModal ref='userAddModal' onSave={onCreateUser} />
          <UserResetPasswordModal ref='userResetPasswordModal' onResetPassword={onResetPassword}/>
        </div>
      </div>
    );
  }
}

export default UserManageList;

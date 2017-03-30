import * as React from 'react';
import { Icon as CustomIcon } from 'common';
import { Dropdown, Menu } from 'antd';
import { getEnvName } from 'common/utils';
import { SimpleLink } from './link';

import './env-link.scss';

const EnvUnit = ({ type, num }) => {
  const envName = getEnvName(type);
  const envIcon = { PRO: 'rocket', PRE: 'fabu', DEV: 'editor2', TEST: 'dashboard' };
  return (
    <div className='env-unit'>
      <CustomIcon type={envIcon[type]} />
      <span>
        {envName}
        {
          num ? <span>({num})</span> : null
        }
      </span>
    </div>
  );
};

class EnvLink extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.envs !== this.props.envs && nextProps.envs[0].id) {
      const _id = _.find(nextProps.envs, { type: nextProps.envType }).id;
      if (nextProps.envId !== _id) {
        this.changeEnv({ key: nextProps.envType }, _id);
      }
    }
  }
  getType() {
    if (isNaN(this.props.envType) || this.props.envs.length === 0) return this.props.envType;
    return _.find(this.props.envs, { id: parseInt(this.props.envType) }).type;
  }
  changeEnv(obj, id) {
    this.props.onChangeEnv(obj.key, id);
  }
  render() {
    const { envs, envType } = this.props;

    const menu = (
      <Menu onClick={(obj) => { const env = _.find(envs, { type: envType }); this.changeEnv(obj, env ? env.id : '0'); }}>
        {
          envs && envs.length > 0 ? envs.map((env) => {
            const type = env.type || env.envType;
            const query = { to: '.', query: { env: isNaN(envType) ? type : env.id } };
            const title = <SimpleLink link={query}><EnvUnit type={type} num={env.number}/></SimpleLink>;
            return (
              <Menu.Item key={type} className='env-select'>
                { title }
              </Menu.Item>
            );
          }) : null
        }
      </Menu>
    );

    return (
      <div className='env-link-box'>
        <div className='env-link'>
          <Dropdown overlay={menu}>
            <div className='env-title'>
              <EnvUnit type={::this.getType()} />
              <i className='arrow'/>
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default EnvLink;

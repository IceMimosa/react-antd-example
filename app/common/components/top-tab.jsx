import * as React from 'react';
import { Tab } from 'common';
import path from 'path-browserify';
import { envDefault } from 'common/utils';
import './top-tab.scss';

const envIdTabList = ['apm'];

const resolvePath = (nextPath, env = undefined) => {
  const rootRoute = path.resolve(window.location.pathname, nextPath);
  return env ? rootRoute.concat('?env=', env) : rootRoute;
};

class TopTabs extends React.Component {
  render() {
    const { activeKey, projectName, tabs, isEnvComponent, envType, isBack, onChange, className, children, backUrl, dots } = this.props;
    const envs = this.props.envs || envDefault;

    const tabList = _.map(tabs, (tab) => {
      const currentEnv = _.find(envs, (u) => { return u.id ? u.type === envType || u.id.toString() === envType : u.envType === envType; });
      const env = envs.length > 0 && envIdTabList.includes(tab.name) ? currentEnv.id : envs.length > 0 ? currentEnv.type || currentEnv.envType : envType;
      return {
        tab: tab.title,
        key: tab.name,
        link: tab.env ? resolvePath('../' + tab.name, env) : resolvePath('../' + tab.name),
        env: tab.env,
        dot: dots ? dots.includes(tab.name) : undefined,
      };
    });

    return (
      <div className={`top-tab ${className || ''}`}>
        <Tab activeKey={activeKey}
          projectName={projectName}
          isEnvComponent={isEnvComponent}
          envs={envs}
          tabs={tabList}
          isBack={isBack}
          envType={envType}
          onChange={onChange}
          backUrl={backUrl}
        />
        {children}
      </div>
    );
  }
}

export default TopTabs;

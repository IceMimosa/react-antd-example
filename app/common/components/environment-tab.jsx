import { Tab } from 'common';
import * as React from 'react';
import { getEnvName } from 'common/utils';


class EnvironmentTab extends React.Component {
  getActiveEnv() {
    return this.refs.tab.state.activeKey;
  }

  render() {
    const { numbers, onChange, initialKey, activeKey, className, tabs, query } = this.props;
    const resultTabs = ['PRO', 'PRE', 'DEV', 'TEST'].map((value) => {
      const name = getEnvName(value);
      const tabProp = tabs && tabs[value];

      let title = '';
      if (numbers) {
        _.forEach(numbers, ({ envType, number }) => {
          if (value === envType) {
            title = `${name}(${number})`;
          }
        });
      } else {
        title = name;
      }

      const key = (tabProp && tabProp.key) || value;
      let link = tabProp && tabProp.link;

      if (!link && query) {
        link = { to: '.', query: { env: key } };
      }
      return {
        tab: title,
        key,
        link,
      };
    });
    return (
      <Tab ref='tab' initialKey={initialKey || 'PRO'} activeKey={activeKey} onChange={onChange} className={className}
        tabs={resultTabs}
      />
    );
  }
}

export default EnvironmentTab;

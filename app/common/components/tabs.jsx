import * as React from 'react';
import classNames from 'classnames';
import { EnvLink, Icon as CustomIcon } from 'common';
import { Badge } from 'antd';
import { Link } from 'react-router';
import { SimpleLink } from './link';

import './tabs.scss';

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.props.activeKey || this.props.initialKey,
    };
  }

  componentDidMount() {
    if (this.props.onChange) {
      this.props.onChange(this.getActiveKey());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey !== this.props.activeKey) {
      this.handleChange(nextProps.activeKey);
    }
  }

  getActiveKey() {
    return this.props.activeKey || this.state.activeKey;
  }

  handleChange(activeKey) {
    if (activeKey === this.getActiveKey()) return;
    this.setState({ activeKey });
    if (this.props.onChange) {
      this.props.onChange(activeKey);
    }
  }

  render() {
    let tabs;
    if (this.props.tabs) {
      tabs = this.props.tabs.map((tab, i) => {
        const active = tab.key === this.getActiveKey();
        return (
          <SimpleLink key={i} link={tab.link}>
            <Badge dot={tab.dot}>
              <div className='tab-unit'>
                <div className={`tabs-tab ${active ? 'active' : ''}`}
                  onClick={e => this.handleChange(tab.key, e)}
                >
                  {tab.tab}
                  <i className='arrow-up'></i>
                </div>
              </div>
            </Badge>
          </SimpleLink>
        );
      });
      const envTabCount = _.filter(this.props.tabs, { env: true }).length;
      if (envTabCount < this.props.tabs.length && envTabCount) {
        tabs.splice(envTabCount, 0, <div key='spliter' className='tab-unit horizontal-line'/>);
      }
    } else {
      tabs = React.Children.map(this.props.children, (el, i) => {
        if (this.props.query) {
          const query = { to: '.', query: { env: el.key } };
          const title = <SimpleLink link={query}>{el.props.tab}</SimpleLink>;
          return (
            <SimpleLink key={i} link={query}>
              <div className={`tabs-tab ${el.key === this.getActiveKey() ? 'active' : ''}`}
                onClick={(e) => this.handleChange(el.key, e)}
              >
                { title }
                <i className='arrow-up'></i>
              </div>
            </SimpleLink>
          );
        }
        return (
          <div key={i} className={`tabs-tab ${el.key === this.getActiveKey() ? 'active' : ''}`}
            onClick={(e) => this.handleChange(el.key, e)}
          >
            {el.props.tab}
            <i className='arrow-up'></i>
          </div>
        );
      });
    }

    const typeClass = this.props.type && `tabs-${this.props.type}`;

    const className = classNames(
      'tabs',
      typeClass,
      this.props.className
    );
    return (
      <div className='tabs-wrap'>
        <div className={className}>
          {
            this.props.isBack || this.props.backUrl ?
              this.props.backUrl ? <Link to={this.props.backUrl} ><CustomIcon type='back' className='back-icon'/></Link> :
              <CustomIcon type='back' className='back-icon' onClick={() => window.history.back()}/> : null
          }

          {
            this.props.projectName ? <span className='tabs-project'>{this.props.projectName}</span> : null
          }
          {
            this.props.isEnvComponent
            ? <span className='env-span'>
              <div className='horizontal-line' />
              <EnvLink envs={this.props.envs} envType={this.props.envType}/>
            </span>
            : null
          }
          {tabs}
        </div>
        { this.props.tabs
          ? undefined
          : (
            <div className='tabs-content'>
              { this.props.children.map((el) => <div className={`tabs-tabpane ${el.key === this.getActiveKey() ? 'active' : ''}`} key={el.key}>{el.props.children}</div>) }
            </div>
          )
        }
      </div>

    );
  }
}

module.exports = Tab;

import { Button, Icon } from 'antd';
import { refTo } from 'common/utils';
import * as React from 'react';

import './log-roller.scss';

class LogRoller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      max: false,
    };
  }
  onScroll() {
    const { rolling, onCancelRolling, onGoToTop } = this.props;
    const distanceToBottom = this.preElm.scrollHeight - this.preElm.scrollTop - this.preElm.clientHeight;
    if (distanceToBottom > 10 && rolling) {
      onCancelRolling();
    }
    if (this.preElm.scrollTop === 0) {
      onGoToTop();
    }
  }

  goToTop() {
    this.props.onGoToTop();
  }

  toggleRolling() {
    const { rolling, onStartRolling, onCancelRolling } = this.props;

    if (rolling) {
      onCancelRolling();
    } else {
      onStartRolling();
    }
  }

  changeSize() {
    this.setState({
      max: !this.state.max,
    });
  }

  render() {
    const { content, loading, rolling, backwardLoading } = this.props;
    const { max } = this.state;

    return (
      <div className={`project-panel log-roller darken${max ? ' showMax' : ''}`}>
        <pre ref={this:: refTo('preElm') } className='log-content' onScroll={:: this.onScroll}>
        {backwardLoading
          ? <div className='log-state'>Loading... <Icon type='loading' /></div>
          : null
        }
        {content}
        {rolling || loading
          ? <div className='log-state'>Loading... <Icon type='loading' /></div>
          : null
        }
        </pre>
        <div className='log-control log-top-control btn-line-rtl'>
          <Button onClick={:: this.changeSize} type ='ghost' icon={max ? 'shrink' : 'arrow-salt'}/>
          </div>
        <div className='log-control btn-line-rtl'>
        {/* <Button type='ghost' shape='circle' icon='reload'/> */}
        <Button onClick={:: this.goToTop} type ='ghost' icon='caret-up'/>
          <Button onClick={:: this.toggleRolling} type ='ghost' icon={rolling ? 'pause' : 'caret-right'}/>
        </div>
      </div>
    );
  }
}

export default LogRoller;

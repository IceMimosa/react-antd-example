import * as React from 'react';
import { Button } from 'antd';
import { findDOMNode } from 'react-dom';
import { createTerm, destoryTerm } from 'common/utils/xterm';
import { TopTabs } from 'common';
import { refTo } from 'common/utils';
import './terminal.scss';

export default class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      max: false,
    };
  }
  componentDidMount() {
    const { type, id } = this.props;
    const el = findDOMNode(this.terminal);
    this.term = createTerm(el, type, id);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.max !== this.state.max) {
      this.term.fit();
    }
  }
  componentWillUnmount() {
    destoryTerm(this.term);
  }
  changeSize() {
    this.setState({
      max: !this.state.max,
    });
  }
  render() {
    const { max } = this.state;
    return (
      <div className='terminal-viewer'>
        <TopTabs isBack projectName='控制台' />
        <div ref={this::refTo('terminal')} className={`terminal-container${max ? ' showMax' : ''}`}>
          <div className='terminal-control btn-line-rtl'>
            <Button onClick={::this.changeSize} type='ghost' icon={max ? 'shrink' : 'arrow-salt'}/>
          </div>
        </div>
      </div>
    );
  }
}

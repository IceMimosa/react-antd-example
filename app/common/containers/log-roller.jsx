import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { TopTabs } from 'common';
import { getFetchStatus, promiseFSA } from 'common/utils/action';
import { refTo, px2Int } from 'common/utils';
import { getLog, clearLog } from 'common/actions';
import PureLogRoller from '../components/log-roller';

const mapStateToProps = (state, ownProps) => {
  const { logKey } = ownProps;
  return {
    logResult: state.logs[logKey],
    isFetching: getFetchStatus(state, getLog, logKey),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { logKey } = ownProps;

  return {
    fetchLog(offset, start) {
      return dispatch(getLog(logKey, offset, start)).then(promiseFSA);
    },
    clearLog() {
      return dispatch(clearLog(logKey));
    },
  };
};

class LogRoller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backwardLoading: false,
      rolling: true,
    };
    this.headOffset = 0;
    this.tailOffset = 0;
    this.appendable = false;
  }

  componentDidMount() {
    const { fetchLog } = this.props;

    // first fetch
    fetchLog(-1, -100)
      .then(({ appendable, headOffset, tailOffset }) => {
        this.headOffset = headOffset;
        this.tailOffset = tailOffset;
        this.appendable = appendable;
        this.setState({ rolling: appendable });
        this.scrollToBottom();
        if (appendable) {
          this.rollingTimeout = setTimeout(::this.forwardLog, 3000);
        }
      });
  }

  componentWillUnmount() {
    this.props.clearLog();
    this.cancelRolling();
  }

  getContentHeight(content) {
    const lineCount = content.split(/\r\n|\r|\n/).length;
    const realCount = lineCount >= 2 ? lineCount - 2 : 0;
    if (realCount === 0) return 0;
    const lineHeightCSS = window.getComputedStyle(this.logRoller.preElm, null).getPropertyValue('line-height');
    const lineHeight = px2Int(lineHeightCSS);

    return realCount * lineHeight;
  }

  scrollAt() {
    return this.logRoller.preElm.scrollTop;
  }

  scrollTo(to) {
    this.logRoller.preElm.scrollTop = to;
  }

  scrollToTop() {
    this.scrollTo(0);
  }

  scrollToBottom() {
    this.scrollTo(Number.MAX_VALUE);
  }

  forwardLog() {
    const { fetchLog } = this.props;

    fetchLog(this.tailOffset, 10000)
      .then(({ appendable, tailOffset }) => {
        this.tailOffset = tailOffset;
        this.appendable = appendable;
        // 在滚动拉取，就跳到最后
        if (this.state.rolling) {
          this.scrollToBottom();
        }
        // 有后续内容并在滚动拉取中，3s 后再拉一次
        if (appendable && this.state.rolling) {
          this.rollingTimeout = setTimeout(::this.forwardLog, 3000);
        }
        // 没有后续内容了，取消滚动拉取
        if (!appendable) {
          this.setState({ rolling: false });
        }
      });
  }

  backwardLog() {
    const { fetchLog } = this.props;

    if (this.state.backwardLoading || this.headOffset === 0) {
      return;
    }
    this.setState({ backwardLoading: true });
    fetchLog(this.headOffset, -100)
      .then(({ headOffset, content }) => {
        this.headOffset = headOffset;
        this.setState({ backwardLoading: false });
        this.scrollTo(this.scrollAt() + this.getContentHeight(content));
      })
      .catch(() => {
        this.setState({ backwardLoading: false });
      });
  }

  startRolling() {
    this.scrollToBottom();
    if (!this.appendable) {
      return;
    }
    this.setState({ rolling: true });
    this.forwardLog();
  }

  cancelRolling() {
    this.setState({ rolling: false });
    if (this.rollingTimeout) {
      clearTimeout(this.rollingTimeout);
      this.rollingTimeout = undefined;
    }
  }

  goToTop() {
    this.scrollToTop();
    this.cancelRolling();
    this.backwardLog();
  }

  render() {
    const { logResult, isFetching, ...otherProps } = this.props;

    return (
      <div className='log-viewer'>
        <TopTabs projectName='查看日志' isBack />
        <PureLogRoller
          ref={this:: refTo('logRoller') }
          content={logResult && logResult.content}
          onStartRolling={:: this.startRolling}
          onCancelRolling={:: this.cancelRolling}
          onGoToTop={:: this.goToTop}
          rolling={this.state.rolling}
          loading={isFetching}
          backwardLoading={this.state.backwardLoading}
          {...otherProps}
        />
      </div>);
  }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LogRoller);

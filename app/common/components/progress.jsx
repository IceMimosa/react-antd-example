import * as React from 'react';
import classNames from 'classnames';


import './progress.scss';

class Progress extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {

    const { num, sum, append } = this.props;

    const style = {
      width: num / sum * 100 + '%'
    };

    const appendStyle = {
      width: append / sum * 100 + '%'
    };

    const result = num + append;

    let appendClass = '';
    if( result == sum ) {
      appendClass = 'progress-full'
    }
    else if (result == 1 || num == 0) {
      appendClass = 'progress-left-full'
    }
    return (
      <div className='progress-line'>
        <div className='progress-outer'>
          <div className='progress-inner'>
            <div className={ num == sum ? 'progress-bg progress-full' : 'progress-bg' } style={style}></div>
            <div className={ `progress-append ${appendClass}` } style={appendStyle}></div>
          </div>
        </div>
        <span className='progress-text'>{result}/{sum}</span>
      </div>
    );
  }
}

module.exports = Progress;

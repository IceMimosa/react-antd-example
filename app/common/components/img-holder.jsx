import Holderjs from 'holderjs';
import ReactDOM from 'react-dom';
import * as React from 'react';

const imgDict = {
  project: '/images/projectLogo.png',
  avatar: '/images/avatar.png',
  default: '/images/t.png',
};

class ImgHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { src: props.src || imgDict[props.type || 'default'] };
  }
  componentDidMount() {
    if (this.isPlaceholder) {
      const holderImg = ReactDOM.findDOMNode(this.refs.holder);
      Holderjs.run({
        images: holderImg,
      });
    }
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  imgErr(type) {
    this.setState({ src: imgDict[type || 'default'] });
  }

  render() {
    const { src, rect, random, size, text, type, ...otherProps } = this.props;
    if (!_.isEmpty(this.state.src)) {
      this.isPlaceholder = false;
      return <img role='presentation' src={this.state.src} onError={() => this.imgErr(type)} {...otherProps} />;
    }
    this.isPlaceholder = true;

    const holderParams = _.chain({ random, size, text }).map((v, k) => {
      if (v === undefined) {
        return undefined;
      }
      return `${k}=${v}`;
    }).compact().value().join('&');
    return <img {...otherProps} role='presentation' data-src={`holder.js/${rect}?${holderParams}`} ref='holder'/>;
  }
}

export default ImgHolder;

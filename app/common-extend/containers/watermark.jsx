import * as React from 'react';
import * as ReactRedux from 'react-redux';

const mapStateToProps = (state) => {
  return {
    loginUser: state.loginUser,
  };
};

const EmptyDiv = () => {
  return <div></div>;
};

class Watermark extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Comp: EmptyDiv,
    };
  }

  componentDidMount() {
    require.ensure(['react-watermark'], (require) => {
      const PureWatermark = require('react-watermark');
      this.setState({ Comp: PureWatermark });
    });
  }

  render() {
    const { Comp } = this.state;
    const { id, nick } = this.props.loginUser;
    const options = Object.assign({}, this.props.options || {}, {
      wm_txt: <span>{`用户ID:${id}`}<br/>{` \n 用户昵称: ${nick}`}</span>,
    });
    return <Comp options={options} />;
  }
}

export default ReactRedux.connect(mapStateToProps)(Watermark);

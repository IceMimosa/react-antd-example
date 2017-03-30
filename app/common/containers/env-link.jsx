import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as CommonAction from 'common/actions';
import PrueEnvLink from '../components/env-link';

const mapStateToProps = (state, ownProps) => {
  const { envType } = ownProps;
  return {
    envType: envType || state.envType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeEnv(envType, envId = '0') {
      dispatch(CommonAction.changeEnv(envType));
      dispatch(CommonAction.changeEnvId(envId));
    },
  };
};

class EnvLink extends React.Component {
  componentWillMount() {
    const query = window.location.search;
    const index = query.indexOf('env');
    if (index !== -1) {
      const envType = query.substring(index + 4);
      this.props.onChangeEnv(envType);
    }
  }
  render() {
    return (
      <PrueEnvLink {...this.props}/>
    );
  }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(EnvLink);

import * as ReactRedux from 'react-redux';
import TopTabs from '../components/top-tab';

const mapStateToProps = (state, ownProps) => {
  const { envType } = ownProps;
  return {
    envType: envType || state.envType,
  };
};

export default ReactRedux.connect(mapStateToProps)(TopTabs);

import * as ReactRedux from 'react-redux';

const mapStateToProps = state => {
  return {
    userAuthorizes: state.loginUser.authorizes,
  };
};

const find = (userAuthorizes, requiredAuthorize) => {
  for (const authorize of userAuthorizes) {
    if (requiredAuthorize.key === authorize.key && requiredAuthorize.targetId == authorize.targetId) {
      return true;
    }
  }
  return false;
};

const Authentication = ({ children, unallowed = null, userAuthorizes, authorizes = [] }) => {
  const requiredAuthorizes = _.isArray(authorizes) ? authorizes : [authorizes];
  for (const authorize of requiredAuthorizes) {
    if (!find(userAuthorizes, authorize)) {
      return unallowed;
    }
  }
  return <span>{children}</span>;
};

export default ReactRedux.connect(mapStateToProps)(Authentication);

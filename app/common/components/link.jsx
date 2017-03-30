import { Link } from 'react-router';
import { resolvePath } from 'common/utils';

export const SimpleLink = ({ children, link, withClass, ...otherProps }) => {
  if (!link) {
    return <span className={withClass ? otherProps.className : undefined}>{children}</span>;
  }

  if (typeof link === 'object') {
    return <Link {...otherProps} to={{ pathname: resolvePath(link.to), query: link.query }}>{children}</Link>;
  }
  return <Link {...otherProps} to={resolvePath(link)}>{children}</Link>;
};

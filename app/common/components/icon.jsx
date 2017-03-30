import classNames from 'classnames';

const Icon = ({ type, className, style, onClick }) => {

  const classes = classNames(
    'iconfont',
    `icon-${type}`,
    className
  );

  return <i className={classes} style={style} onClick={onClick} />
};

export default Icon;

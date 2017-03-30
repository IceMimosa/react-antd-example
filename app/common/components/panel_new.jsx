import './panel_new.scss';

const Panel = ({ title, children, style, className = '' }) => {
  return (
    <div className={`panel ${className}`} style={style}>
      <div className='panel-title'>{title}</div>
      <div className='panel-body'>
        {children}
      </div>
    </div>
  );
};

export default Panel;

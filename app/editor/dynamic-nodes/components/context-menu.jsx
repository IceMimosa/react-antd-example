import * as React from 'react';
import './context-menu.scss';

class ContextMenu extends React.Component {

  render() {
    const { style, className, id, munuList = [] } = this.props;
    const classes = className ? `context-menu ${className}` : 'context-menu';
    return (
      <ul className={classes} style={style} id={id} >
        {munuList.map((menu) => {
          return <li className='context-li' onClick={menu.onClick} key={menu.name}>{menu.name}</li>
        })}
      </ul>
    );
  }
}

export default ContextMenu;
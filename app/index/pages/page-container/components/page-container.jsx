import * as React from 'react';
import { PersonNative, WaterMark } from 'common-extend';
import Sidebar from '../containers/sidebar';

import './page-container.scss';

const ConsoleApp = ({ children }) => {
  return (
    <div className='console'>
      <div className='console-body'>
        <WaterMark />
        <Sidebar />
        <div className='content'>
          <div id='mainView' className='main'>
            <PersonNative />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleApp;

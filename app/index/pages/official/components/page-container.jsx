import * as React from 'react';
import Header from '../components/header';

import './page-container.scss';

const ConsoleApp = ({ children }) => {
  return (
    <div className='official-console'>
      <Header />
      <div className='console-body'>
        <div className='content'>
          <div id='mainView' className='main'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleApp;

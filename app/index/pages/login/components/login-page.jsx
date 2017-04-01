import * as React from 'react';
import LoginBox from '../containers/login-box';
import './login-page.scss';

const Header = () => (
  <header className='index-header'>
    <div className='index-wrapper'>
      {/*<div className={`logo logo-${window._profile_}`}></div>*/}
      <ul className='header-nav'>
        <li>
          <a href='#'>首页</a>
        </li>
        <li>
          <a href='#'>帮助手册</a>
        </li>
        <li>
          <a href='#'>关于我们</a>
        </li>
      </ul>
    </div>
  </header>
);

export default class PageIndex extends React.Component {
  render() {
    return (
      <div className='index-page'>
        <Header />
        <LoginBox />
      </div>
    );
  }
}

import { Icon as CustomIcon } from 'common';

import './navigator.scss';

const Navigator = ({ step, middleTitle }) => {
  return (
    <div className='nav-guide'>
      <div className={`nav nav-log ${step === 1 ? 'active' : 'finish'} `}>
        <div className='circle-name'>
        {
          step === 1 ? 1 : <CustomIcon className='icon-success' type='success'/>
        }
        </div>
        <div className='rect'>注册账号</div>
        <div className='circle-cover'></div>
      </div>
      <div className={`nav nav-join ${step === 2 ? 'active' : (step === 1 ? '' : 'finish')}`}>
        <div className='circle-name'>
        {
          step <= 2 ? 2 : <CustomIcon className='icon-success' type='success'/>
        }
        </div>
        <div className='rect'>{middleTitle}</div>
        <div className='circle-cover'></div>
      </div>
      <div className={`nav nav-finish ${step === 3 ? 'active' : ''}`}>
        <div className='circle-name'>3</div>
        <div className='rect'>申请成功</div>
      </div>
    </div>
  );
};

export default Navigator;

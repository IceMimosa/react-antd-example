import { notification } from 'antd';
import { registerHandler } from './ws';

export function init(dispatch) {
  registerHandler('ALERT', ({ payload }) => {
    notification.info({
      message: '提示',
      description: payload,
    });
    // or dispatch action
  });
}

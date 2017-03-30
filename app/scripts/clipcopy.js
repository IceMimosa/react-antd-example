import Clipboard from 'clipboard';
import { message } from 'antd';

const clipcopy = (elements) => {
  elements = elements || document.querySelectorAll('.copy');
  const clipboard = new Clipboard(elements);
  clipboard.on('success', ({ text }) => {
    message.success(text + ' 复制成功');
  });

  clipboard.on('error', () => {
    message.error('复制失败,请再次尝试');
  });
};

export default clipcopy;

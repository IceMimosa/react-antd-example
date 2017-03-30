import Notify from 'title-notify';

export default function generateNotify(title = '新通知', body = '', openurl = '', callback) {
  new Notify({}).notify({
    title,
    body,
    openurl,
    icon: '/images/t.png',
    onclick: () => {
      if (callback) callback();
    }
  });
}

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient;
const handlerMap = {};
let defaultHandler;

export function connect() {
  const socket = new SockJS('/api/ws');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, () => {
    stompClient.subscribe('/user/topic/notification', msg => {
      const notification = JSON.parse(msg.body);

      if (handlerMap[notification.type] !== undefined) {
        handlerMap[notification.type](notification);
      } else {
        if (defaultHandler !== undefined) {
          defaultHandler(notification);
        }
      }
    });

    stompClient.send('/app/api/ws/check', {}, '');
  });
}

export function disconnect() {
  if (stompClient !== undefined) {
    stompClient.disconnect();
  }
}

export function registerHandler(type, handler) {
  handlerMap[type] = handler;
}

export function registerDefaultHandler(handler) {
  defaultHandler = handler;
}

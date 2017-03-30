import Terminal from 'xterm';
import 'xterm/dist/addons/attach/attach';
import 'xterm/dist/addons/fit/fit';
import 'terminal-colors';

const Input = {
  default: '0',
  ping: '1',
  resize: '2',
};
const Output = {
  default: '0',
  pong: '1',
};

const pingTime = 30; // ping间隔，单位秒

export function createTerm(container, type, id) {
  const term = new Terminal({
    cursorBlink: true,
    useStyle: true,
    screenKeys: true,
  });
  term.on('resize', size => {
    const { cols, rows } = size;
    sendData(term, Input.resize, JSON.stringify({ rows, cols }));
  });
  term.open(container);
  term.fit();
  const { rows, cols } = term.proposeGeometry();
  const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
  const url = `${protocol}${location.hostname}${location.port ? `:${location.port}` : ''}`;
  const socket = new WebSocket(`${url}/api/ws/ssh?type=${type}&id=${id}&timeout=${pingTime}&rows=${rows}&cols=${cols}`);
  // const socket = new WebSocket('ws://61.172.240.74:4567/api/machines/61.172.240.76/console');
  socket.onopen = () => runTerminal(term, socket);
  socket.onclose = () => {
    term.writeln('connect is close......'.lightMagenta);
  };
  socket.onerror = () => {
    term.writeln('error......'.lightMagenta);
  };
  let timer;
  term._onResize = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      term.fit();
    }, 500);
  };
  window.addEventListener('resize', term._onResize);
  return term;
}


function runTerminal(term, socket) {
  term.attach(socket);
  proxyInput(term);
  proxyOutput(term, socket);
  term._pingInterval = setInterval(() => {
    sendData(term, Input.ping);
  }, pingTime * 1000);
  term._initialized = true;
}

function proxyInput(term) {
  const _sendData = term._sendData;
  term.off('data', _sendData);
  term._sendData = (data) => {
    _sendData(Input.default + data);
  };
  term.on('data', term._sendData);
}

function sendData(term, type, data) {
  if (term.socket) {
    term.socket.send(type + (data || ''));
  }
}

function proxyOutput(term, socket) {
  const _getMessage = term._getMessage;
  socket.removeEventListener('message', _getMessage);
  term._getMessage = (ev) => {
    let data = ev.data;
    const type = data.substr(0, 1);
    switch (type) {
      case Output.pong:
        break;
      case Output.default:
        data = data.substr(1);
        data = data.replace(/\+/g, '%20');
        data = decodeURIComponent(data);
        _getMessage({ data });
        break;
      default:
        break;
    }
  };
  socket.addEventListener('message', term._getMessage);
}

export function destoryTerm(term) {
  if (term._onResize) {
    window.removeEventListener('resize', term._onResize);
  }
  if (term.socket) {
    term.socket.close();
  }
  if (term._pingInterval) {
    clearInterval(term._pingInterval);
  }
  term.destroy();
}

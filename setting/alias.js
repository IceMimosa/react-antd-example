const production = process.env.NODE_ENV === 'production';

const getAlias = (path, __dirname) => {
  const baseAlias = {
    react: path.join(__dirname, './node_modules/react/dist/react.js'),
    redux: path.join(__dirname, './node_modules/redux/dist/redux.js'),
    echarts: path.join(__dirname, './node_modules/echarts/dist/echarts.js'),
    'react-dom': path.join(__dirname, './node_modules/react-dom/dist/react-dom.js'),
    'react-redux': path.join(__dirname, './node_modules/react-redux/dist/react-redux.js'),
    'react-router': path.join(__dirname, './node_modules/react-router/lib/index.js'),
    'redux-promise': path.join(__dirname, './node_modules/redux-promise/lib/index.js'),

    color: path.join(__dirname, './app/styles/_color.scss'),
    messages: path.join(__dirname, './app/messages.js'),
    agent: path.join(__dirname, './app/agent.js'),
    ws: path.join(__dirname, './app/ws.js'),
    'common': path.join(__dirname, './app/common'),
    'common-extend': path.join(__dirname, './app/common-extend'),
    'login-user': path.join(__dirname, './app/login-user.js'),
    editor: path.join(__dirname, './app/editor'),
    index: path.join(__dirname, './app/index'),
    scripts: path.join(__dirname, './app/scripts'),
    'user': path.join(__dirname, './app/user'),
  };

  const buildAlias = {
    react: 'react/dist/react.min.js',
    redux: 'redux/dist/redux.min.js',
    'react-dom': 'react-dom/dist/react-dom.min.js',
  };
  
  return production ? Object.assign({}, baseAlias, buildAlias) : baseAlias;
};

module.exports = getAlias;

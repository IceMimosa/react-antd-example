## 简介
主要基于 [react](https://github.com/facebook/react) 和 [antd](https://github.com/ant-design/ant-design) 的一个demo项目。

## 准备环境
- Node: use NVM
- Install: [yarn](https://github.com/yarnpkg) 或者 npm

## 运行示例
该demo中包含多种运行方式，以方便开发，运行方式如下：

- 使用 [Koa2](https://github.com/koajs/koa) 开启 `mock` 环境进行测试，拦截 `/api/*` 的链接
- 使用 [koa-proxy](https://github.com/popomore/koa-proxy) 将 `/api/*` 的链接转发至后台服务器
- 使用 `nginx` 转发 `/api/*` 的链接和静态资源
- 生产环境打包， 同样需要 `nginx` 的转发

### 方式一
不需要对后台（Java等环境）进行联调，使用 `Koa` 进行本地的开发和测试，所有的 **mock数据** 和 **路由数据** 都位于项目的 `mock目录` 中。 比如 `mock/users.js` 的用户测试数据。

```
-- 使用步骤，进入demo目录

1. rm -rf node_modules
2. yarn 或者 npm install
3. npm run watch:server :m
```

打开浏览器访问 `http://localhost:3000/`，输入账号密码：`18888888888` / `123456`

这里默认开启的 `3000端口`，可以使用参数 `:p` 或者 `::port` 参数， 比如执行 `npm run watch:server :m :p=3001`

### 方式二
取消本地的mock环境，将 `/api/*` 转发至后台。这里需要启动后台环境（如Java工程等）。

```
-- 使用步骤，进入demo目录

1. rm -rf node_modules
2. yarn 或者 npm install
3. npm run watch:server
```

打开浏览器访问 `http://localhost:3000/`，账号密码由后台提供。

同样这里默认开启的 `3000端口`，可以使用参数 `:p` 或者 `::port` 参数进行修改。
转发的地址默认是 `localhost:8080`，可以使用参数 `:r` 或者 `::remote` 参数进行修改，如 `::r=localhost:8089`

### 方式三
取消基于`Koa`的node服务环境，所有的静态资源和`/api/*`的接口都交给nginx进行转发。

* 开启nginx服务，配置文件如：

```
upstream example_server {
    server localhost:8080;
}

server {
  listen 80;
  server_name  react-antd.example.io;

  root /project/react-antd-example/public;

  # individual nginx logs for this web vhost
  access_log  /tmp/access.log;
  error_log   /tmp/error.log;

  #when not specify request uri, redirect to /index;
  location = / {
     try_files $uri /index.html;
  }

  #server assets
  location = /favicon.ico {
     try_files $uri $uri/;
  }

  location ^~ /fonts/ {
     try_files $uri $uri/;
  }

  location ^~ /styles/ {
     try_files $uri $uri/;
  }

  location ^~ /images/ {
     try_files $uri $uri/;
  }

  location ^~ /scripts/ {
     #break;
     try_files $uri $uri/;
  }

  location ~ /(.*)\.html {
     try_files $uri /index.html;
  }

  location ~ /(.*)\.hbs {
     try_files $uri $uri/;
  }

  location ~ /api/ws/* {
      proxy_pass http://example_server;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
  }

  location ~ /api/* {
     proxy_pass http://example_server;
     proxy_set_header        X-Real-IP $remote_addr;
     proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header        Host $http_host;
  }

  # set url to url.html
  location ~ /(.*){
     try_files $uri $uri.html;
  }

  location / {
     proxy_pass http://example_server;
     proxy_set_header        X-Real-IP $remote_addr;
     proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header        Host $http_host;
  }
}
```

> nginx 配置注意几点

* 域名 `react-antd.example.io` 需要在 `/etc/hosts` 中进行配置，映射到 **localhost**
* root的目录为项目打包产生的 `public` 文件夹
* 第二行是转发给后台的主机和端口，这里给了 `localhost:8080`
* 重启nginx服务


> 最后前台项目启动

```
1. rm -rf node_modules
2. yarn 或者 npm install
3. npm run watch
```

打开浏览器访问 `http://react-antd.example.io`，账号密码由后台提供。
后续所有的ajax访问和静态资源都由nginx进行转发。

## 模块开发
例子可以参考项目中的user模块。

> 创建 creators

参考：[redux-creators](https://github.com/IceMimosa/redux-creator)

### 创建 Actions (废弃)
每个模块需要创建一个action文件

* 导入所需要的方法

```
import { actionTypeCreatorWithNameSpace, createAction } from 'common/utils/action';
```

* 创建 action

```js
const actionTypeCreator = actionTypeCreatorWithNameSpace('model');
export const myMethod = createAction(actionTypeCreator('myMethod'), (params) => {
	return someHttpFetchPromise(params);
}, someMetaInfo);

# 此时会生成一个符合 FSA 标准的 action ，type 为 `model#myMethod`
# 第二个参数为handler，可以发起ajax操作，不写默认是 `(params) => params`

## myMethod: 方法名称
## someHttpFetchPromise: ajax操作, 可以使用项目中的superagent
## someMetaInfo: 其他一些配置，比如是否获取异步的状态，是否缓存等等。如 `{fetch: {processing: true}`
```

### 创建 Reducers (废弃)
每个模块需要创建一个reducer文件，然后需要在 `app/reducers.js` 中进行注册。

* 导入所需要的方法

```
import { createReducer } from 'reducers/util/reducer';
```

* 创建 reducer

```js
import * as UserAction from 'user/actions'; // 或则其他actions

export const currentUserInfo = createReducer(on => {
	on(UserAction.getCurrentUserInfo)
		.completed((state, action) => {return newState;})
	 	.failed((state, action) => {console.log(action.payload)});
	on(someOtherActionCreator);
}, {});

# 通过 `on(actionCreator)` 来注册对应 action 的 reducer 。可以注册 completed 和 failed 两种方法
# 两种都可以省略，默认是 completed: `(state, action) => action.payload` ，failed: `(state, action) => console.log(action.payload)`
# 如果在创建action的时候使用了cache, 可以通过 `common/utils/action` 里的 `invalidateCache` 方法来手动失效 cache
# 如果在创建action的时候将获取异步状态设成了true，可以通过 `common/utils/action` 里的 `getFetchStatus` 来获取当前action方法的处理状态。
# getFetchStatus方法可以在 containers 中的 `mapStateToProps` 中使用，如 getFetchStatus(state, UserAction.getCurrentUserInfo)
```



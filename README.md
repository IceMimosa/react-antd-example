## 简介
主要基于 [react](https://github.com/facebook/react) 和 [antd](https://github.com/ant-design/ant-design) 的一个demo项目。

## 准备环境
- Node: use NVM
- Install: [yarn](https://github.com/yarnpkg) 或者 npm

## 运行示例
该demo中包含多种运行方式，以方便开发，运行方式如下：

- 使用 [Koa2](https://github.com/koajs/koa) 开启 `mock` 环境进行测试，拦截 `/api/*` 的链接
- 使用 [koa-proxy](https://github.com/popomore/koa-proxy) 将 `/api/*` 的链接转发至后台服务器
- 使用 `nginx` 将 `/api/*` 的链接进行转发
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



## Redux Actions and Reducers

- 为每一组实体创建一个 action 和 reducer 文件

- 使用 `import { actionTypeCreatorWithNameSpace, createAction } from 'common/utils/action';` 来创建 action

  ```js
  const actionTypeCreator = actionTypeCreatorWithNameSpace('model');
  export const get = createAction(actionTypeCreator('get'), (id) => {
    return someHttpFetchPromise(id);
  }, someMetaInfo);
  ```

  会生成一个符合 FSA 标准的 action ，type 为 `model#get` 。其中第二个 handler 和第三个 metaInfo 都是选填，handler 如果不填则默认为：`(data) => data` 。

  异步动作可支持 fetch processing 状态和 cache ，通过 meta 来设置：

  ```js
  {
    fetch: {
      processing: true,
      processingKey: id, // 按 key 来分开存储 processing 状态，可选
      cache: { // 也可以直接写 true
        timeout: 3000, // 不填或未 -1 时则不主动失效
        key: id // 按 key 来分开 cache ，可选
      }
    }
  }
  ```

  例如：

  ```js
  export const get = createAction(actionTypeCreator('get'), (id) => someHttpFetchPromise(id),
    (id) => {
      return {
        fetch: {
          processing: true,
          processingKey: id,
          cache: {
            timeout: 1000 * 60 * 5,
            key: id
          }
        }
      };
    }
  );
  ```

  别的一些需要传递给 reducer 的内容都可以放在 meta 里传递。

- 使用 `import { createReducer } from 'reducers/util';` 来创建 reducer

  ```js
  import * as DevTeamAction from 'actions/dev-team';

  export const currentUserDevTeamList = createReducer(on => {
    on(DevTeamAction.listByCurrentUser).completed((state, action) => {return newState;})
      .failed((state, action) => {console.log(action.payload)});
    on(someOtherActionCreator);
  }, []);
  ```

  通过 `on(actionCreator)` 来注册对应 action 的 reducer 。对于会失败的 action ，可以注册 completed 和 failed 两种。

  两种都可以省略，默认是 completed: `(state, action) => action.payload` ，failed: `(state, action) => console.log(action.payload)` 。

- 通过 `common/utils/action` 里的 `invalidateCache` 方法来手动失效 cache ，`getFetchStatus` 方法来获取某个 fetch processing 状态



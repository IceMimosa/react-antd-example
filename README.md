## Workflow

### Requirements

- Node: use NVM

### How to start

- `rm -rf node_modules`
- `npm install`
- `npm run build / watch`

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

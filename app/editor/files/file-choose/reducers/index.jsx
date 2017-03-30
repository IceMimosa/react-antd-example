import { createReducer } from 'common/utils/reducer';
import * as FileAction from '../actions';

export const folderTree = createReducer(on => {
  on(FileAction.initTree)
    .completed((state, action) => {
      return action.payload;
    });
  on(FileAction.emptyTree)
    .completed((state, action) => {
      return action.payload;
    });
  on(FileAction.addTree)
    .completed((state, action) => {
      return action.payload;
    });
}, { tree: [{ name: '/', key: '/' }] });

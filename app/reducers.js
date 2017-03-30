import { combineReducers } from 'redux';

import commonReducers from 'common/reducers';
import * as userReducers from 'user/reducers';

export default combineReducers({
  ...userReducers,
  ...commonReducers,
});

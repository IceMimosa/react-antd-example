
import Cookie from 'js-cookie';

class LoginUser {
  constructor(user) {
    _.forEach(user, (v, k) => {
      this[k] = v;
    });
  }
}

export default LoginUser;

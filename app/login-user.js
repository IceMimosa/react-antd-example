
import Cookie from 'js-cookie';

class LoginUser {
  constructor(user) {
    _.forEach(user, (v, k) => {
      this[k] = v;
    });

    if (_.find(this.roles, role => role.roleKey === 'systemAdmin')) {
      this.allowedTypes = ['SYS_ADMIN'];
    } else if (_.find(this.roles, role => role.roleKey === 'orgAdmin')) {
      this.allowedTypes = ['COMPANY_ADMIN', 'DEVELOPER'];
    } else {
      this.allowedTypes = ['DEVELOPER'];
    }

    const typeInCookie = Cookie.get('userType');
    if (_.includes(this.allowedTypes, typeInCookie)) {
      this.realType = typeInCookie;
    } else {
      Cookie.remove('userType');
      this.realType = this.allowedTypes[0];
    }
  }

  isActive() {
    return this.status === 'ACTIVE';
  }

  hasRole(roleType, targetId) {
    if (_.isEmpty(this.roles)) {
      return false;
    }
    const targetRole = _.find(this.roles, role => {
      return role.role === roleType && (targetId === undefined || role.targetId === targetId);
    });
    return targetRole !== undefined;
  }
}

export default LoginUser;

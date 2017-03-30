function getUserRouter() {
  return [
    {
      path: 'users',
      indexRoute: {
        getComponent(location, cb) {
          System.import('user/pages/user-manage').then((module) => cb(null, module.default));
        },
        onEnter: ::this.onSystemAdminEnter,
      },
    }, {
      path: 'users/profile',

      childRoutes: [
        {
          path: 'person',
          getComponent(location, cb) {
            System.import('user/pages/profile/containers/user-setting-basic').then((module) => cb(null, module.default));
          },
        },
        {
          path: 'org',
          getComponent(location, cb) {
            System.import('user/pages/profile/containers/user-setting-org').then((module) => cb(null, module.default));
          },
        },
        {
          path: 'api',
          getComponent(location, cb) {
            System.import('user/pages/profile/containers/user-setting-openAPI').then((module) => cb(null, module.default));
          },
        },
      ],
    },
  ];
}

export default getUserRouter;

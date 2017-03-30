function wrapGetComponent(fun) {
  return function (nextState, cb) {
    fun.call(this, nextState, (error, component) => {
      this.component = component;
      cb(error, component);
    });
  };
}

export const wrapRoutes = (routes) => {
  for (let i = 0, len = routes.length; i < len; i++) {
    const { getComponent, childRoutes, indexRoute } = routes[i];
    if (typeof getComponent === 'function') {
      routes[i].getComponent = wrapGetComponent(getComponent);
    }
    if (indexRoute && indexRoute.getComponent) {
      indexRoute.getComponent = wrapGetComponent(indexRoute.getComponent);
    }
    if (childRoutes) {
      wrapRoutes(childRoutes);
    }
  }
};

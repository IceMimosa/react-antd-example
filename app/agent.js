import agentUse from 'superagent-use';
import agent from 'superagent';

const superagent = agentUse(agent);

const statusActions = {};

export const setStatusAction = (status, action, timeout = 0) => {
  statusActions[status] = { timeout, action };
};

function endPromise(req) {
  const _Promise = Promise;

  return new _Promise((resolve, reject) => {
    req.end((err, res) => {
      const statusAction = statusActions[res.status];
      if (!_.isEmpty(statusAction)) {
        if (statusAction.timeout > 0) {
          setTimeout(statusAction.action, statusAction.timeout);
        } else {
          statusAction.action();
        }
      }
      const error = err || res.error;
      if (error) {
        error.status = res.status;
        if (res.text !== undefined && res.text !== '') {
          error.message = res.text;
        }
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

function then(...args) {
  const promise = endPromise(this);
  return promise.then.apply(promise, args);
}

function _catch(...args) {
  const promise = endPromise(this);
  return promise.catch.apply(promise, args);
}

/**
 * Adds req.then and req.catch methods
 * @param {Object} req
 * @return {Object} req
 */
function superagentPromisePlugin(req) {
  req.then = then;
  req.catch = _catch;
  return req;
}

/**
 * Patches superagent so that every request has req.then and req.catch methods
 * @param {Object} superagent
 * @return {Object} superagent
 */
superagentPromisePlugin.patch = function patch(sa) {
  sa.Request.prototype.then = then;
  sa.Request.prototype.catch = _catch;
  return sa;
};

superagent.use(superagentPromisePlugin);

export default superagent;

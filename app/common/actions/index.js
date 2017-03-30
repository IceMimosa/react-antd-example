import agent from 'agent';
import { createAction, actionTypeCreatorWithNameSpace } from 'common/utils/action';

const actionTypeCreator = actionTypeCreatorWithNameSpace('common');

export const getLog = createAction(actionTypeCreator('getLog'), (logKey, start, offsetLines) => {
  return agent.get(`/api/logs/${logKey}`)
    .query({ start, offsetLines })
    .then(response => response.body);
}, (logKey, start, offsetLines) => {
  return {
    logKey,
    forward: offsetLines > 0,
    fetch: {
      processing: true,
      processingKey: logKey,
    },
  };
});

export const clearLog = createAction(actionTypeCreator('clearLog'));

export const changeEnv = createAction(actionTypeCreator('changeEnv'));

export const changeEnvId = createAction(actionTypeCreator('changeEnvId'));

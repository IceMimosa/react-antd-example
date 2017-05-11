import agent from 'agent';
import { createAction, actionTypeCreatorWithNameSpace } from 'common/utils/action';

const actionTypeCreator = actionTypeCreatorWithNameSpace('user');

export const refreshLogined = createAction(actionTypeCreator('refreshLogined'), () => {
  return agent.get('/api/users/current')
    .then(response => response.body);
});

export const getLogined = createAction(actionTypeCreator('getLogined'), () => {
  return agent.get('/api/users/current')
    .then(response => response.body);
});

export const login = createAction(actionTypeCreator('login'), (loginInfo) => {
  return agent.post('/api/users/login')
    .type('form')
    .send(loginInfo)
    .then(response => response.body);
});

export const search = createAction(actionTypeCreator('search'), (query) => {
  return agent.get('/api/users/search')
    .query(query)
    .then(response => response.body);
});

export const logout = createAction(actionTypeCreator('logout'), () => {
  return agent.post('/api/users/logout')
    .then(true);
});

export const nativeLogout = createAction(actionTypeCreator('nativeLogout'));

export const getCurrentUserInfo = createAction(actionTypeCreator('getCurrentUserInfo'), () => {
  return agent.get('/api/users/current')
    .then(response => response.body);
});

export const create = createAction(actionTypeCreator('userById'), (user) => {
  return agent.post('/api/users')
    .type('form')
    .send(user)
    .then(response => response.body);
});

export const putProfile = createAction(actionTypeCreator('putProfile'), (userProfile) => {
  return agent.put('/api/users/current/profile')
    .type('form')
    .send(userProfile)
    .then(response => response.body);
});
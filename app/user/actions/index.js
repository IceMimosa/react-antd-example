import agent from 'agent';
import { createAction, actionTypeCreatorWithNameSpace } from 'common/utils/action';

const actionTypeCreator = actionTypeCreatorWithNameSpace('user');

export const search = createAction(actionTypeCreator('search'), (query) => {
  return agent.get('/api/users/search')
    .query(query)
    .then(response => response.body);
});

export const create = createAction(actionTypeCreator('userById'), (user) => {
  return agent.post('/api/users')
    .type('form')
    .send(user)
    .then(response => response.body);
});

export const resetPassword = createAction(actionTypeCreator('userById'), (userId, password) => {
  return agent.post(`/api/users/${userId}/resetPassword`)
    .type('form')
    .send({ password });
});

export const lockUser = createAction(actionTypeCreator('userById'), (userId) => {
  return agent.post(`/api/users/${userId}/lock`);
});

export const unlockUser = createAction(actionTypeCreator('userById'), (userId) => {
  return agent.post(`/api/users/${userId}/unlock`);
});

export const login = createAction(actionTypeCreator('login'), (loginInfo) => {
  return agent.post('/api/users/login')
    .type('form')
    .send(loginInfo)
    .then(response => response.body);
});

export const logout = createAction(actionTypeCreator('logout'), () => {
  return agent.post('/api/users/logout')
    .then(true);
});

export const nativeLogout = createAction(actionTypeCreator('nativeLogout'));

export const getLogined = createAction(actionTypeCreator('getLogined'), () => {
  return agent.get('/api/users/current')
    .then(response => response.body);
});

export const refreshLogined = createAction(actionTypeCreator('refreshLogined'), () => {
  return agent.get('/api/users/current')
    .then(response => response.body);
});

export const changePassword = createAction(actionTypeCreator('userById'), (password) => {
  return agent.post('/api/users/current/password')
    .type('form')
    .send(password);
});

export const putProfile = createAction(actionTypeCreator('putProfile'), (userProfile) => {
  return agent.put('/api/users/current/profile')
    .type('form')
    .send(userProfile)
    .then(response => response.body);
});

export const suggest = createAction(actionTypeCreator('suggest'), (key) => {
  return agent.get('/api/users/suggest')
    .query({ key })
    .then(response => response.body);
});

export const cleanSuggest = createAction(actionTypeCreator('cleanSuggest'));

export const getUserInfo = createAction(actionTypeCreator('userById'), (userId) => {
  return agent.get(`/api/users/${userId}`)
    .then(response => response.body);
});

export const getCurrentUserInfo = createAction(actionTypeCreator('getCurrentUserInfo'), () => {
  return agent.get('/api/users/current')
    .then(response => response.body);
});

export const orgApply = createAction(actionTypeCreator('orgApply'), (orgId) => {
  return agent.post(`/api/users/current/orgs/${orgId}/apply`);
});

export const orgLeave = createAction(actionTypeCreator('orgLeave'), (orgId) => {
  return agent.del(`/api/users/current/orgs/${orgId}/leave`);
});

export const orgApplyCancel = createAction(actionTypeCreator('orgApplyCancel'), (orgId) => {
  return agent.del(`/api/users/current/orgs/${orgId}/apply`);
});

export const updateEmail = createAction(actionTypeCreator('updateEmail'), (values) => {
  return agent.post('/api/users/modifyEmail')
            .type('form')
            .send(values)
            .then(response => response.body);
});

export const sendVerfiCode = createAction(actionTypeCreator('senVerfiCode'), (tel) => {
  return agent.post('/api/users/modifyMobile/sms')
              .type('form')
              .send(tel)
              .then(response => response.body);
});

export const updatePhone = createAction(actionTypeCreator('updatePhone'), (values) => {
  return agent.put('/api/users/modifyMobile')
              .type('form')
              .send(values)
              .then(response => response.body);
});


export const getOpenToken = createAction(actionTypeCreator('getOpenToken'), () => {
  return agent.get('/api/users/openToken')
    .then(response => response.body);
});

export const turnOnOpenAPI = createAction(actionTypeCreator('turnOnOpenAPI'), () => {
  return agent.put('/api/users/openToken')
    .then(response => response.body);
});

export const turnOffOpenAPI = createAction(actionTypeCreator('turnOffOpenAPI'), () => {
  return agent.del('/api/users/openToken');
});

// 注册账号
export const registerAccount = createAction(actionTypeCreator('registerAccount'), (values) => {
  return agent.post('/api/users/register')
            .type('form')
            .send(values)
            .then(response => response.body);
});

// 注册验证码
export const sendRegisterVerfiCode = createAction(actionTypeCreator('sendRegisterVerfiCode'), (moblie) => {
  return agent.post('/api/users/register/sms')
              .type('form')
              .send(moblie)
              .then(response => response.body);
});

export const registerOrg = createAction(actionTypeCreator('registerOrg'), (orgId) => {
  return agent.post(`/api/users/current/orgs/${orgId}/apply`)
              .then(response => response.body);
});

export const createOrg = createAction(actionTypeCreator('createOrg'), (values) => {
  return agent.post('/api/orgs')
              .type('form')
              .send(values)
              .then(response => response.body);
});

export const changeSiderActiveKey = createAction(actionTypeCreator('changeSiderActiveKey'));

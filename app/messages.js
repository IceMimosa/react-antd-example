const messages = {
  ['some.error']: '某种错误',
  ['user.not.login']: '未登录，可能是用户信息已超时，请重新登录',
  ['user.not.exists']: '用户不存在',
  ['user.locked']: '用户被锁定',
  ['user.incorrect.password']: '密码错误',
};

export const getMessage = (messageCode) => {
  if(messages[messageCode]){
    return messages[messageCode]
  }
  try {
    let messageObj = JSON.parse(messageCode);
    messageCode = messageObj.errorMsg
  } catch (err) {
    
  }
  return messageCode;
};

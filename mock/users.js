/**
 * user mock data
 * @see /app/user/actions
 */
import { Fields, Response } from './httpUtil';

// 模拟用户信息, 密码信息视情况而定, 一般不返回给前端
const users = [{
  id: 1,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author1@example.com',
  mobile: '18888888881',
  password: '123456',
  nick: '用户1',
}, {
  id: 2,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author2@example.com',
  mobile: '18888888882',
  password: '123456',
  nick: '用户2',
}, {
  id: 3,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author3@example.com',
  mobile: '18888888883',
  password: '123456',
  nick: '用户3',
}, {
  id: 4,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author4@example.com',
  mobile: '18888888884',
  password: '123456',
  nick: '用户4',
}, {
  id: 5,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author5@example.com',
  mobile: '18888888885',
  password: '123456',
  nick: '用户5',
}, {
  id: 6,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author6@example.com',
  mobile: '18888888886',
  password: '123456',
  nick: '用户6',
}, {
  id: 7,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author7@example.com',
  mobile: '18888888887',
  password: '123456',
  nick: '用户7',
}, {
  id: 8,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author8@example.com',
  mobile: '18888888888',
  password: '123456',
  nick: '用户8',
}];

/**
 * 当前登录的 user 对象
 */
let currentUser;

module.exports = (router) => {
  router.get('/api/users/current', (ctx, next) => {
    Response.ok(ctx, currentUser);
  });

  router.post('/api/users/login', (ctx, next) => {
    const username = Fields.get(ctx, 'username');
    const password = Fields.get(ctx, 'password');
    for (const user of users) {
      if (user.mobile === username) {
        if (user.password !== password) {
          Response.error(ctx, '密码错误');
          return next();
        }
        currentUser = user;
        Response.ok(ctx, user);
        return next();
      }
    }
    Response.error(ctx, '用户不存在');
  });

  router.get('/api/users/search', (ctx, next) => {
    const pageNo = Fields.getQuery(ctx, 'pageNo') || 1;
    const pageSize = Fields.getQuery(ctx, 'pageSize') || 5;
    Response.ok(ctx, {
      total: users.length,
      list: users.slice((pageNo - 1) * pageSize, pageNo * pageSize),
    });
  });

  router.put('/api/users/current/profile', (ctx, next) => {
    const nick = Fields.get(ctx, 'nick');
    for (const user of users) {
      if (user.id === currentUser.id) {
        user.nick = nick;
        currentUser = user;
      }
    }
    Response.ok(ctx, null);
  });

  router.post('/api/users', (ctx, next) => {
    const mobile = Fields.get(ctx, 'mobile');
    const nick = Fields.get(ctx, 'nick');
    // const password = Fields.get(ctx, 'password');
    const email = Fields.get(ctx, 'email');
    const id = users[users.length - 1].id + 1;
    // user
    const user = {
      id,
      avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
      email,
      mobile,
      nick,
    };
    users.push(user);
    Response.ok(ctx, user);
  });
};

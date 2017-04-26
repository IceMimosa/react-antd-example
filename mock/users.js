/**
 * user mock data
 */
const users = [{
  id: 1,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author1@example.com',
  mobile: '18888888881',
  nick: '用户1'
}, {
  id: 2,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author2@example.com',
  mobile: '18888888882',
  nick: '用户2'
}, {
  id: 3,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author3@example.com',
  mobile: '18888888883',
  nick: '用户3'
}, {
  id: 4,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author4@example.com',
  mobile: '18888888884',
  nick: '用户4'
}, {
  id: 5,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author5@example.com',
  mobile: '18888888885',
  nick: '用户5'
}, {
  id: 6,
  avatar: 'http://7xsz2j.com1.z0.glb.clouddn.com/G.jpg',
  email: 'author6@example.com',
  mobile: '18888888886',
  nick: '用户6'
}]

let currentUser
module.exports = (router) => {
  router.get('/api/users/current', (ctx, next) => {
    ctx.body = currentUser
  })
  router.post('/api/users/login', (ctx, next) => {
    const username = ctx.request.fields.username
    const password = ctx.request.fields.password
    for (const user of users) {
      if (user.mobile === username) {
        currentUser = user
        ctx.body = user
        return next()
      }
    }
    ctx.status = 500
    ctx.body = {
      errorMsg: "用户不存在"
    }
  })
  // TODO: 
}
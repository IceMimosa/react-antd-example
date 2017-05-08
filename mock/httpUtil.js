const qs = require('qs')

/**
 * 获取 request 中的字段信息
 */
exports.Fields = {
  get: (ctx, name) => {
    if (!!ctx.request.fields) {
      return ctx.request.fields[name]
    }
  },
  getQuery: (ctx, name) => {
    // https://github.com/tunnckoCore/koa-better-body/issues/77
    return ctx.querystring[name] || qs.parse(ctx.querystring)[name]
  },
}

/**
 * response 响应
 */
exports.Response = {
  ok: (ctx, context) => {
    ctx.body = context
  },
  error: (ctx, error) => {
    ctx.status = 500
    ctx.body = {
      errorMsg: error
    }
  },
}
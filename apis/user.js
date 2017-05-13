'use strict';

const wechatService = require('../services/wechat');

/**
 * @api {get} /v1/logout 登出
 * @apiName logout
 *
 */
exports.logout = function * () {
  this.session.user = null;
  this.status = 401;
};


exports.getOpenId = function * () {
  let { code } = this.query;
  if (!code) return this.status = 400;
  
  let res = yield wechatService.getAuthCode(code);
  if (res.errmsg) {
    this.status = 400;
    this.body = { msg: res.errmsg };
    return;
  }

  this.body = { openid: res.openid };
}

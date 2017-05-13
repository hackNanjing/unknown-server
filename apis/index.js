'use strict';

const router = require('koa-router')();
const body = require('koa-better-body');

/*
  controllers
*/
const user = require('./user');

router
  .get('/v1/auth', user.getOpenId)
  .get('/v1/user/logout', user.logout)

module.exports = router;

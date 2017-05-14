const router = require('koa-router')();

/*
  controllers
*/
const user = require('./user');
const auth = require('../middlewares/auth');

router
  .get('/v1/auth', user.getOpenId)
  .post('/v1/users/login', user.login)
  .post('/v1/users/end', auth, user.end)
  .get('/v1/users/history', auth, user.history)
  .get('/v1/users/profile', auth, user.profile)
  .get('/v1/users/rank', auth, user.rank)
  .post('/v1/users/form-id', auth, user.postFormId)
  .get('/notify', user.notifyAll);

module.exports = router;

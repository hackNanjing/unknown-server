const wechatService = require('../services/wechat');
const moment = require('moment');
const userService = require('../services/user');
const Recommend = require('../models/recommend');
const History = require('../models/history');
const User = require('../models/user');
const PushId = require('../models/push_id');

exports.getOpenId = function* () {
  const { code } = this.query;
  if (!code) return this.status = 400;

  const res = yield wechatService.getAuthCode(code);
  if (res.errmsg) {
    this.status = 400;
    this.body = { msg: res.errmsg };
    return;
  }

  this.body = { openid: res.openid };
};

exports.login = function* () {
  const { wechat, location } = this.request.body;

  const user = yield User.findOneAndUpdate({ 'wechat.openid': wechat.openid }, {
    wechat,
    location,
  }, { upsert: true });
  this.body = { token: user._id };
};

//  GET /users/start 开始计时
exports.start = function* () {

};

// POST /users/end 上一次的排名和这一次的排名
exports.end = function* () {
  const { success_minute, total_minute, startAt, recommendId } = this.request.body;
  const { _id: id, total, before_rank } = this.user;

  yield userService.saveHistory({
    success_minute,
    total_minute,
    startAt,
    Recommend: recommendId,
    User: id,
    endAt: Date.now(),
    status: success_minute >= total_minute ? 3 : 0,
  });

  yield userService.addTotal(id, (total + success_minute));

  if (recommendId) {
    Recommend.findByIdAndUpdate(recommendId, {
      status: 3,
    });
  }

  const meRank = yield userService.getMeRank(id);
  yield User.findByIdAndUpdate(id, {
    before_rank: meRank,
  });
  this.body = {
    now: meRank,
    before_rank,
  };
};

// GET /users/history 获取历史记录 今天所有
exports.history = function* () {
  const { _id: id } = this.user;
  const list = yield History.find({
    User: id,
    startAt: {
      $gte: new Date(moment().subtract(8, 'hour').format('YYYY-MM-DD')),
    },
  });

  this.body = JSON.parse(JSON.stringify(list)).map((h) => {
    h.startAt = moment(h.startAt).format('HH:MM');
    h.endAt = moment(h.endAt).format('HH:MM');
    return h;
  });
};

// GET /users/profile 获取总分和个人排名
exports.profile = function* () {
  const { _id: id, total } = this.user;

  const rank = yield userService.getMeRank(id);
  this.body = {
    total,
    rank,
  };
};

// GET /users/rank 获取排行榜
exports.rank = function* () {
  const { _id: id } = this.user;

  const rank = yield userService.getRank(id);
  this.body = rank;
};

// post /users/form-id
exports.postFormId = function* () {
  const { id } = this.request.body;
  const { _id: uid } = this.user;

  this.body = yield PushId.create({ formId: id, User: uid });
};

exports.notifyAll = function* () {
  yield userService.notifyAll();
  this.body = 'success';
};

const History = require('../models/history');
const User = require('../models/user');
const PushId = require('../models/push_id');
const request = require('request-promise');
const config = require('../config/default');
const moment = require('moment');

const service = {
  saveHistory(data) {
    return History.create(data);
  },

  addTotal(id, total) {
    return User.findByIdAndUpdate(id, {
      total,
    });
  },

  * getRank(id) {
    const user = yield User.findById(id);
    const { location } = user;

    return User.find({
      location: {
        $nearSphere: location,
        $maxDistance: 1000,
      },
    }).sort('-total');
  },

  * getMeRank(id) {
    const rank = yield service.getRank(id);

    return (rank.findIndex(r => String(r._id) === String(id))) + 1;
  },

  * notifyAll() {
    const res = yield request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.app_id}&secret=${config.app_secret}`);
    const { access_token } = JSON.parse(res);
    const users = yield User.find();
    for (const user of users) {
      const pushId = yield PushId.findOne({ User: user._id });
      if (pushId) {
        const res2 = yield request(`https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`, {
          method: 'POST',
          body: {
            touser: user.wechat.openid,
            template_id: '6yNOo9Gg0kW_5k0DPpUVGVhQOTRIg2xuc68VJt0vKFI',
            page: '/pages/rank',
            form_id: pushId.formId,
            data: {
              keyword1: {
                value: '每日附近排行榜',
                color: '#173177',
              },
              keyword2: {
                value: moment().format('YYYY-MM-DD'),
              },
            },
          },
          json: true,
        });
        yield PushId.remove({ _id: pushId._id });
      }
    }
  },
};

module.exports = service;

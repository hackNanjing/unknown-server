const moment = require('moment');
const History = require('../models/history');
const User = require('../models/user');
const PushId = require('../models/push_id');
const schedule = require('node-schedule');
const request = require('request-promise');
const config = require('../config/default.json');
const co = require('co');

const service = {
  start() {
    service.jobGetRecommend();
    service.jobPushRank();
  },
  // 1. 通知 recommend, 在哪个时间段挑战的最多 (09:00-09:30, 13:00-13:30, 21:00-22:00) 取三小时内的时间
  // 默认 2个30分钟 1个1小时,  取最小和最大, 如果最小最大都一样取默认值
  // 算出来入库
  jobGetRecommend() {
    schedule.scheduleJob('1 * * * * *', () => {
      co(function* () {
        const historys = yield History.find({
          startAt: {
            $gte: new Date(moment().subtract(8, 'hour').format('YYYY-MM-DD')),
          },
          endAt: {
            $lte: new Date(moment().add(1, 'day').subtract(8, 'hour').format('YYYY-MM-DD')),
          },
        });

        const hours = historys.map(h => ({
          hour: parseInt(moment(h.startAt).format('HH')),
          id: h._id,
        }));

        const resultMap = new Map();
        for (let i = 0; i < 24; i += 3) {
          hours.forEach((h) => {
            if (h.hour <= i && h.hour >= i - 3) {
              const value = resultMap.get(i);
              if (value) {
                resultMap.set(h.hour, value + 1);
              } else {
                resultMap.set(h.hour, 1);
              }
            }
          });
        }

        let max = 0;
        let maxHour = 0;
        let min = null;
        let minHour = 0;
        for (const [k, v] of resultMap) {
          if (!min) {
            min = v;
          }

          if (v >= max) {
            max = v;
            maxHour = k;
          }
          if (v < min) {
            min = v;
            minHour = k;
          }
        }

        let recommends = [];
        if (min === max || !min || !max) {
          recommends = [{ start: 9, total: 30 },
            { start: 13, total: 30 }, { start: 21, total: 60 }];
        } else {

        }
      }).catch(console.error);
    });
  },
  // 2. 定时推送地理位置排行榜, 推送, 不入库 每晚8点
  jobPushRank() {
    schedule.scheduleJob('1 * * * * *', () => {
      co(function* () {
        const res = yield request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.app_id}&secret=${config.app_secret}`);
        const { access_token } = JSON.parse(res);
        const users = yield User.find();
        for (const user of users) {
          const pushId = yield PushId.findOne({ User: user._id });
          if (pushId) {
            yield request(`https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`, {
              body: {
                touser: user.wechat.openid,
                template_id: 1,
                page: '',
                form_id: PushId.formId,
              },
              json: true,
            });
          }
        }
      }).catch(console.error);
    });
  },
  // 3. recommend, 快到点推送 (5分钟)
  jobPushRecommend() {

  },
};

module.exports = service;

const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const historySchema = new mongoose.Schema({
  status: Number, // 0: 失败 1: 进行中 2:暂停 3:成功
  success_minute: Number, // 完成分钟数
  total_minute: Number, // 总计分总数
  User: {
    ref: 'User',
    type: ObjectId,
  },
  Recommend: {
    ref: 'Recommend',
    type: ObjectId,
  },
  startAt: {
    type: Date,
    default: Date.now(),
  },
  endAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('History', historySchema);

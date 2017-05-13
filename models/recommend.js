const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = new mongoose.Schema({
  status: Number, // 0: 失败 1: 进行中 3:成功
  total_minute: Number, // 总计分总数
  level: String, // 难度等级
  User: {
    ref: 'User',
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Recommend', Schema);

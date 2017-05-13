const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const Schema = new mongoose.Schema({
  wechat: Object,
  location: {
    type: [Number],
    index: {
      type: '2dsphere',
      sparse: true,
    },
  },
  total: {
    default: 0,
    type: Number,
  },
  before_rank: {
    default: 0,
    type: Number,
  },
});

module.exports = mongoose.model('User', Schema);

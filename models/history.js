'use strict';

const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const historySchema = new mongoose.Schema({
  status: number,
  startAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
}, { collection: 'history' });

module.exports = mongoose.model('History', historySchema);

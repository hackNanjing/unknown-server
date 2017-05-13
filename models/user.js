'use strict';

const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const uesrSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: String,
  supwd: String
}, { collection: 'user' });

module.exports = mongoose.model('User', uesrSchema);

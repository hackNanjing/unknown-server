const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = new mongoose.Schema({
  formId: String,
  User: {
    ref: 'User',
    type: ObjectId,
  },
});

module.exports = mongoose.model('PushId', Schema);

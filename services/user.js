const History = require('../models/history');
const User = require('../models/user');

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
};

module.exports = service;

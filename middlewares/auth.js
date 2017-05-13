const User = require('../models/user');

module.exports = function* (next) {
  const { auth } = this.headers;
  if (!auth) {
    this.status = 403;
  } else {
    const user = yield User.findById(auth);
    if (!user) {
      this.status = 403;
    } else {
      this.user = user;
      yield next;
    }
  }
};

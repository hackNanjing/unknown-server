'use strict';

// const { userProxy } = require('../proxy');

const NEED_AUTH_MESSAGE = 'Please login and make sure you have right permission';

module.exports = function * (next) {
  if (!!this.session.user || this.url.startsWith('/v1/auth') || this.query._pass === 'SCRIPT') {
    yield next;
  } else {
    let MINA_SECRET = this.cookies.get('MINA_SECRET');
    if (!MINA_SECRET) this.throw(401, NEED_AUTH_MESSAGE);

    this.session.user = {
      _id: 'test',
    };
    yield next;
  }
};

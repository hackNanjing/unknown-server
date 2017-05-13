const assert = require('assert');
const request = require('supertest');
const app = require('../index');
const User = require('../models/user');
const co = require('co');

describe('user ctrl', () => {
  it('create', (done) => {
    const u = {
      wechat: {
        openid: '1234',
      },
      location: [12.11, 12.11],
    };

    request(app)
      .post('/v1/users/login')
      .send(u)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('end', (done) => {
    request(app)
      .post('/v1/users/end')
      .set('auth', '5917306418db9a4b1ca67a42')
      .send({
        success_minute: 80,
        total_minute: 100,
        startAt: Date.now(),
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('histroy', (done) => {
    request(app)
      .get('/v1/users/history')
      .set('auth', '5917306418db9a4b1ca67a42')
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('profile', (done) => {
    request(app)
        .get('/v1/users/profile')
        .set('auth', '5917306418db9a4b1ca67a42')
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          done();
        });
  });

  it('rank', (done) => {
    request(app)
        .get('/v1/users/rank')
        .set('auth', '5917306418db9a4b1ca67a42')
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          done();
        });
  });
});

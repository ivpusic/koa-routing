'use strict';

var app = require('./app'),
  profileApi = require('./profile-api'),
  // declare /users route
  usersApi = app.route(/\/user\/?/);

usersApi.get(function * (next) {
  this.body = 'from get';
  yield next;
});

usersApi.post(function * (next) {
  this.body = 'from post';
  yield next;
});

usersApi.put(function * (next) {
  this.body = 'from put';
  yield next;
});

// declare /users/:id/profile
usersApi.nested(/\/profile/, profileApi);
module.exports = usersApi;

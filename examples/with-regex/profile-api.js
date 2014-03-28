'use strict';

var getHandler = function * (next) {
  this.body = 'GET profile';
  yield next;
};

module.exports = function () {
  this
    .get(getHandler)
    .post(function * (next) {
      this.body = 'POST profile';
      yield next;
    });
};

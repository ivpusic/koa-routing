/*jshint expr: true*/
'use strict';

var koa = require('koa'),
  request = require('supertest'),
  routing = require('..');

var app = koa(),
  users;

describe('router is', function () {

  before(function () {
    app.use(routing(app)).should.be.ok;
    users = app.route('/users');

    users.get(function * (next) {
      this.body = {
        message: 'from users GET'
      };
      yield next;
    }).should.be.ok;

    users.post(function * (next) {
      this.body = 'from users POST';
      yield next;
    }).should.be.ok;

    users.nested('/:id')
      .get(function * (next) {
        this.body = this.request.params.id;
        yield next;
      })
      .post(function * (next) {
        this.body = {
          message: 'ok'
        };
        yield next;
      }).should.be.ok;

    app.route(/^\/date\/\d{4}-\d{2}-\d{2}\/?/)
      .get(function * (next) {
        this.body = 'date sent';
        yield next;
      })
      .post(function * (next) {
        this.body = 'date sent from post';
        yield next;
      })
      .nested(/\/add\/?/)
      .get(function * (next) {
        this.body = 'added to date';
        yield next;
      })
      .nested(/\/days/)
      .get(function * (next) {
        this.body = 'added days to date';
        yield next;
      })
      .post(function * (next) {
        this.body = 'added days to date from POST';
        yield next;
      });

    app.route('/multipleMiddleware')
      .get(function * (next) {
        this.body = '1';
        this.status = 200;
        yield next;
      }, function * (next) {
        this.body = '2';
        yield next;
      });

    app.route('/before')
      .before(function * (next) {
        this.status = 300;
      })
      .get(function * (next) {
        this.body = 'should not be here';
        this.status = 200;
        yield next;
      });

  });

  describe('goint into regular routes', function () {
    it('now should GET /users', function (done) {
      request(app.listen())
        .get('/users')
        .expect('Content-Type', /json/)
        .expect({
          message: 'from users GET'
        })
        .expect(200, done);
    });

    it('now should POST /users', function (done) {
      request(app.listen())
        .post('/users')
        .expect('from users POST')
        .expect(200, done);
    });

    it('now should GET /users/:id where id is 1234', function (done) {
      request(app.listen())
        .get('/users/1234')
        .expect('1234')
        .expect(200, done);
    });

    it('now should not GET /users/:id/unknown', function (done) {
      request(app.listen())
        .get('/users/2/unknown')
        .expect(404, done);
    });

    it('now should not GET /users/:id/', function (done) {
      request(app.listen())
        .post('/users/2/')
        .expect({
          message: 'ok'
        })
        .expect(200, done);
    });
  });

  describe('going into regex routes', function () {
    it('now should GET /date/2013-09-04', function (done) {
      request(app.listen())
        .get('/date/2013-09-04')
        .expect(200, done);
    });

    it('now should GET /date/2013-09-04/add', function (done) {
      request(app.listen())
        .get('/date/2013-09-04/add')
        .expect('added to date')
        .expect(200, done);
    });

    it('now should not GET /date/2013-09-04/addd', function (done) {
      request(app.listen())
        .get('/date/2013-09-04/addd')
        .expect(404, done);
    });

    it('now should GET /date/2013-09-04/add/days', function (done) {
      request(app.listen())
        .get('/date/2013-09-04/add/days')
        .expect('added days to date')
        .expect(200, done);
    });

    it('now should not GET /date/2013-09-04/add/dayss', function (done) {
      request(app.listen())
        .get('/date/2013-09-04/add/dayss')
        .expect(404, done);
    });

    it('now should POST /date/2013-09-04/add/days', function (done) {
      request(app.listen())
        .post('/date/2013-09-04/add/days')
        .expect('added days to date from POST')
        .expect(200, done);
    });
  });

  describe('going into /before route for .before testing', function () {
    it('will be error expected for GET /before', function (done) {
      request(app.listen())
        .get('/before')
        .expect(300, done);
    });
  });

  describe('going into /multipleMiddleware route for multiple middleware testing', function () {
    it('will be error expected for GET /before', function (done) {
      request(app.listen())
        .get('/multipleMiddleware')
        .expect('2')
        .expect(200, done);
    });
  });
});

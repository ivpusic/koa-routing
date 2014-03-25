'use strict';

var methods = require('methods'),
  assert = require('assert'),
  Route = require('./route'),
  utils = require('./utils');

var routes = [];

function init(app) {
  app.route = function (path) {
    assert.equal(utils.anyBy(routes, 'path', path), false, 'You already defined this path');

    routes.push(new Route(path));
    return routes[routes.length - 1];
  };
}

function Router(app) {
  assert(app, 'You must provide app instance to use routing');
  init(app);

	return new Router().middleware();
}

Router.prototype.middleware = function * (next) {
	yield next;
};

Router.prototype.match = function (route) {
  routes.forEach(function (route) {
    if (route.match.apply(this, arguments)) {
      console.log('matched!');
    }
    console.log('eeee');
  });
};

module.exports = Router;

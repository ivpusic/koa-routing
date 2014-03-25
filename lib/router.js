'use strict';

/**
 * koa-routing
 *
 * @module router
 *
 * @author Ivan Pusic
 * @license MIT
 */

var methods = require('methods'),
  assert = require('assert'),
  Route = require('./route'),
  utils = require('./utils');

/**
 * cache for ``Route`` objects
 */

var routes = [];

/**
 * Extending koa app with ``route`` method
 *
 * @param {Object} app Koa app instance
 * @return {}
 *
 * @api private
 */

function extendApp(app) {
	/**
	 * Method for defining path to match
	 *
	 * @param {String|RegExp} path Route path. You can pass String or RegExp instance
	 * @return {Route}
	 *
	 * @api public
	 */
  app.route = function (path) {
    assert.equal(utils.anyBy(routes, 'path', path), false, 'You already defined this path');

    routes.push(new Route(path));
    return routes[routes.length - 1];
  };
}

/**
 * Router initialization. 
 * You must provide application instance in order to use ``koa-routing``.
 * After this function you will be able to set your routes via ``route`` method,
 * which will be added to your application instance.
 *
 * @param {Object} app koa app
 * @return {Router}
 *
 * @api public
 */

function Router(app) {
	if (this instanceof Router) { 
		return this;
	}
  assert(app, 'You must provide app instance to use routing');

	// exend passed app with koa-routing`` methods
  extendApp(app);

  // return middleware for dispatching requests
	return new Router(app).middleware();
}

/**
 * Middleware for dispatching requests.
 * If route is matched it calls handler function
 *
 * @api private
 */

Router.prototype.middleware = function () {
	var router = this,
		cb;

	return function * (next) {
		for (var i = 0, l = routes.length; i < l; i ++) {
			// search for route
			if ((cb = routes[i].match(this.request))) {
				// if some route is matched, call method which handles that route
				return yield cb.apply(this, arguments);
			}
		}

		// none of routes are matched...
		return yield next;
	};
};

/**
 * Expose Router
 */

module.exports = Router;

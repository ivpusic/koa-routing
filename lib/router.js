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
  utils = require('./utils'),
  compose = require('koa-compose');

/**
 * Extending koa app with ``route`` method
 *
 * @param {Object} app Koa app instance
 *
 * @return {}
 * @api private
 */

function extendApp(app) {
  /**
   * Method for defining path to match
   *
   * @param {String|RegExp} path Route path. You can pass String or RegExp instance
   *
   * @return {Route}
   * @api public
   */
  var self = this;
  app.route = function(path) {
    assert.equal(utils.anyBy(self.routes, 'path', path), false, 'You already defined this path');

    self.routes.push(new Route(path));
    return self.routes[self.routes.length - 1];
  };
}

/**
 * Router initialization.
 * You must provide application instance in order to use ``koa-routing``.
 * After this function you will be able to set your routes via ``route`` method,
 * which will be added to your application instance.
 *
 * @param {Object} app koa app
 *
 * @return {Router}
 * @api public
 */

function Router(app, options) {
  if (this instanceof Router) {
    /**
     * cache for ``Route`` objects
     */
    this.options = options || {};
    this.routes = [];
    // exend passed app with koa-routing`` methods
    extendApp.call(this, app);
    return this;
  }
  assert(app, 'You must provide app instance to use routing');



  // return middleware for dispatching requests
  return new Router(app,options).middleware();
}

/**
 * Middleware for dispatching requests.
 * If route is matched it calls handler function
 *
 * @api private
 */

Router.prototype.middleware = function() {
  var cbs;
  var self = this;
  return function * (next) {
    for (var i = 0; i < self.routes.length; i++) {
      // search for route
      if ((cbs = self.routes[i].match(this.request))) {
        // add named url parameters to ``ctx.params``
        this.params = this.request.params;
        // if in defer mode , run other middleware first
        if (self.options.defer === true) {
          yield next;
        }
        if (self.routes[i]._beforeFn) {
          cbs.splice(0, 0, self.routes[i]._beforeFn);
        }
        return yield compose(cbs);
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
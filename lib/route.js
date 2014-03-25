'use strict';

/**
 * koa-routing
 *
 * @module route
 *
 * @author Ivan Pusic
 * @license MIT
 */

var methods = require('methods'),
  pathToRegExp = require('path-to-regexp');

/**
 * Cache for HTTP methods handlers
 */

var handlers = {};

/**
 * Route object for saving route path and HTTP method handlers for route
 */

function Route(path) {
  this.params = [];
  this.pathRegex = path instanceof RegExp ? path : pathToRegExp(path, this.params);

  return this;
}

/**
 * Function for matching route object with received koa request object
 *
 * @param {Object} request koa request object
 * @return {Generator|null} 
 *
 * @api private
 */

Route.prototype.match = function (request) {
  if (this.pathRegex.test(request.path)) {
    if (!handlers[request.method]) {
      return null;
    }

    // get values of named parameters
    var paramsValues = request.path.match(this.pathRegex).slice(1),
      params = {};

    for (var i = 0, l = paramsValues.length; i < l; i++) {
      params[this.params[i].name] = paramsValues[i];
    }

    // add named url parameters to ``request.params``
    request.params = params;

    // return handler for HTTP method
    return handlers[request.method];
  }

	// route is no matched
  return null;
};

/**
 * Define supported HTTP methods for Route object
 */

methods.forEach(function (METHOD) {
  Route.prototype[METHOD] = function (cb) {
    handlers[METHOD.toUpperCase()] = cb;
    return this;
  };
});

/**
 * Expose Route
 */

module.exports = Route;

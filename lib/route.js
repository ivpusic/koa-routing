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
 * Route object for saving route path and HTTP method handlers for route
 */

function Route(path) {

  /**
   * Cache for HTTP methods handlers
   */

  this.handlers = {};

  /**
   * nested route object
   */

  this._nested = null;

  /**
   * path String object
   */

  this.path = path;

  /**
   * named parameters of route
   */

  this.params = [];

  /**
   * RegExp of path
   */

  this.pathRegex = path instanceof RegExp ? path : pathToRegExp(path, this.params);

  /**
   * return instance
   */

  return this;
}

/**
 * Function for matching route object with received koa request object
 *
 * @param {Object} request koa request object
 *
 * @return {Generator|null}
 * @api private
 */

Route.prototype.match = function (request) {
  if (this.pathRegex.test(request.path)) {
    if (!this.handlers[request.method]) {
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
    return this.handlers[request.method];
  } else if (this._nested) {
    return this._nested.match(request);
  }

  // route is no matched
  return null;
};

/**
 * Define supported HTTP methods for Route object
 */

methods.forEach(function (METHOD) {
  Route.prototype[METHOD] = function () {
    this.handlers[METHOD.toUpperCase()] = Array.prototype.slice.apply(arguments);
    return this;
  };
});

/**
 * Ability to nest routes
 *
 * @param {String} path path of nested route
 * @param {Function} cb callback function after nested route is created
 *
 * @return {Route}
 * @api public
 */

Route.prototype.nested = function (path, cb) {
  this._nested = new Route(this.path.concat(path));
  cb.call(this._nested);

  return this;
};

/**
 * Expose Route
 */

module.exports = Route;

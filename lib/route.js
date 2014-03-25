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

var handlers = {};

/**
 *
 */

function Route(path) {
	this.pathRegex = path instanceof RegExp ? path : pathToRegExp(path, this.params);
	return this;
}

/**
 *
 */

Route.prototype.match = function (request) {
	if (this.pathRegex.test(request.path)) {
		if (!handlers[request.method]) {
			return null;
		}

		var matches = request.path.match(this.pathRegex).slice(1);
		return handlers[request.method];
	}

	return null;
};

/**
 *
 */

methods.forEach(function (METHOD) {
	Route.prototype[METHOD] = function (cb) {
		handlers[METHOD.toUpperCase()] = cb;
		return this;
	};
});

/**
 *
 */

module.exports = Route;

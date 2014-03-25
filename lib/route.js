'use strict';

var methods = require('methods'),
	_ = require('lodash');

function Route(path) {
	this.path = path;

	return this;
}

methods.forEach(function (method) {
	Route.prototype[method] = function (cb) {
		return this;
	};
});

Route.prototype.match = function () {

};

module.exports = Route;

'use strict';

/**
 * koa-routing
 *
 * @module utils
 *
 * @author Ivan Pusic
 * @license MIT
 */

var assert = require('assert');

/**
 * Filter object by some condition
 *
 * @param {Object} obj object to filter
 * @param {String} by key to match
 * @param {Value} value value to match
 * @param {Boolean} any if is setted to true, function will return true if value with key is found in object
 *
 * @return {Object|Boolean}
 * @api private
 */

function filterBy(obj, by, value, any) {
  var res = [];

  for (var key in obj) {
    if (obj[key][by] === value) {
      if (any) {
        return true;
      }
      res.push(obj[key]);
    }
  }
  return any ? false : res;
}

/**
 * Function for testing if object property have some value
 *
 * @param {Object} obj object to filter
 * @param {String} by key to match
 * @param {Value} value value to match
 *
 * @return {Boolean}
 * @api private
 */

function anyBy(obj, by, value) {
  return filterBy(obj, by, value, true);
}

/**
 * Check if given fn instance of GeneratorFunction
 *
 * @param {Function} fn Function to check
 * @param {Route} ctx Object for providing information in case of error
 *
 * @throws {Exception}
 * @api private
 */
function isGenerator(fn, ctx) {
  assert(fn && fn.constructor && fn.constructor.name === 'GeneratorFunction',
    'You must provide GeneratorFunction for route ' + ctx.path);
}

/**
 * expose above functions
 */

module.exports.filterBy = filterBy;
module.exports.anyBy = anyBy;
module.exports.isGenerator = isGenerator;

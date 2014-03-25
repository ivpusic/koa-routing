'use strict';

/**
 * koa-routing
 *
 * @module utils
 *
 * @author Ivan Pusic
 * @license MIT
 */

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
 * expose above functions
 */

module.exports.filterBy = filterBy;
module.exports.anyBy = anyBy;

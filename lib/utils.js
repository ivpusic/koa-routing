'use strict';

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

function anyBy(obj, by, value) {
  return filterBy(obj, by, value, true);
}

module.exports.filterBy = filterBy;
module.exports.anyBy = anyBy;

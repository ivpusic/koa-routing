var koa = require('koa'),
  routing = require('koa-routing');

var app = module.exports = koa();
app.use(routing(app));
require('./users-api');

app.listen(4000);

koa-routing
================
[![Build Status](https://travis-ci.org/ivpusic/koa-routing.svg?branch=master)](https://travis-ci.org/ivpusic/koa-routing)
[![Dependency Status](https://gemnasium.com/ivpusic/koa-routing.svg)](https://gemnasium.com/ivpusic/koa-routing)
## Installation
```
npm install koa-routing
```

## Motivation

I wanted to separate my route definitions into multiple files. Also I wanted to make easier to specify route handlers, and execute some methods before some set of routes, for example ensuring that user is authenticated before doing some action. So I developed [koa-r](https://github.com/ivpusic/koa-r) and [koa-routing](https://github.com/ivpusic/koa-routing) to achieve that. Final result is something like this:

**/routing/index.js** file
```
module.exports = function (app) {
  require('./users')(app.route('/api/users').before(authenticate));
};
```

**/routing/users.js** file
```
/**
 * /api/users
 */

module.exports = function (route) {
  /* GET /api/users */
  route.get(r('user', 'getUsers'));

  /* GET /api/users/logout */
  route.nested('/logout').get(r('user', 'logout'));
};
```

So here you can see that we are specifying handlers for route with ``r('module', 'method')`` pattern, and we are also following DRY principle when we define our routes.

If you like this idea, you are on right place.

### Example

Let's define following routes:
- ``/users`` [GET, POST, PUT],
- ``/users/list`` [GET, PUT]

With ``koa-routing`` you can nest routes, and on that way you can follow DRY principle.
Also ``koa-routing`` architecture help you to separate route handlers into multiple files. That example will be shown also.

```
var koa = require('koa'),
	routing = require('koa-routing');

var app = koa();
app.use(routing(app));

app.route('/users')
  .get(function * (next) {
    this.body = 'from get';
    yield next;
  })
  .post(function * (next) {
    this.body = 'from post';
    yield next;
  })
  .put(function * (next) {
    this.body = 'from put';
    yield next;
  })
  .nested('/list')
    .get(function * (next) {
      this.body = 'from users list GET';
      yield next;
    });
    .put(function * (next) {
      this.body = 'from users list PUT';
      yield next;
    });

app.listen(4000);
```
**You should put ``koa-routing`` middleware after body parsers and simmilar middlewares which are preparing request for you, or passing an options object with a ``defer`` field setted to ``true``**.

As you can see, you can pass classic ``express`` route style, such as ``/user/:id``, and after that you can read received values from ``this.params`` or ``this.request.params`` object.

You can pass also regex as route path.

## API

#### route
``koa-routing`` extends you application instance with ``route`` method.
You can use that method for defining route path.

```
app.route('/users/:id');
```

#### HTTP methods

After you define your route, you need set ``HTTP`` methods for that route.
In following example you need to replace ``someHTTPmethod`` with one of supported
``node`` ``HTTP`` methods. That can be ``GET``, ``POST``, ``PUT``, etc...

```
app.route('route path').someHTTPmethod(handler);
```

So you can type something like:
```
var handler = function * () {
  yield next;
};

app.route('api/users').get(handler);
```

Keep in mind that every call returns router instance, so everything can be chained.

#### nested

Let's we say that you have for routes something like this:
- ``/api/users/profile/data``
- ``/api/users/profile/image``
- etc.

You see that you are repeating ``/api/users/profile`` for every route, and we don't want to do that.
``koa-routing`` have nice solution for this with ``nested`` function.

```
// first you type fixed part
var route = app.route('/api/users/profile');

route.nested('/data')
  .get(function * (next) { yield next; });
  // here you can also define other HTTP operations, like POST, PUT, etc
  // example of put...
  .put(function * (next) { yield next; });

route.nested('/image')
  .get(function * (next) { yield next; });
```

Keep in mind that nested creates new route for you and returns created route. You can continue nesting routes. It is up to you.

#### before

You can define function which will be executed before each route method, and before all nested routes.
```
app.route('/someRoute')
	.before(function * (next) {
		this.status = 300;
	})
	.get(function * (next) {
		this.body = 'should not be here';
		this.status = 200;
		yield next;
	});
```

#### all

This function will be executed if there is no matching HTTP method.
```
app.route('/someRoute')
	.all(function * (next) {
		this.body = 'will catch GET/POST/PUT... etc';
		this.status = 200;
		yield next;
	})
```

## Other features

#### Multiple middlewares

With ``koa-routing`` you can provide multiple middlewares for each route method:
```
app.route('/multipleMiddleware')
	.get(function * (next) {
		this.body = '1';
		this.status = 200;
		yield next;
	}, function * (next) {
		this.body = '2';
		yield next;
	});
```

If you go to this route you will receive ``2`` as a result, because request will be passed
to each defined handler.

#### Options

```
app.use(routing(app,options));
```

* ``defer`` Default is false. If true, serves after yield next, allowing any downstream middleware to respond first.

## Contributing

Feel free to send pull request with some new awesome feature or some bug fix.
But please provide some tests with your contribution.

# License
**MIT**

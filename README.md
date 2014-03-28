koa-routing
================
[![Build Status](https://travis-ci.org/ivpusic/koa-routing.svg?branch=master)](https://travis-ci.org/ivpusic/koa-routing)
[![Dependency Status](https://gemnasium.com/ivpusic/koa-routing.svg)](https://gemnasium.com/ivpusic/koa-routing)

Manage koa routes on right way.

## About

This is ``koa`` routing middleware which will help you to manage and define your application routes.

### Installation
```
npm install koa-routing
```

### Example 1

Let's define following routes:
- ``/users`` [GET, POST, PUT],
- ``/users/:id/profile`` [GET],
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
  .nested('/:id/profile', function () {
    this
      .get(function * (next) {
        this.body = 'profile for user ' + this.request.params.id;
        yield next;
      });
  })
  .nested('/list', function () {
    this
      .get(function * (next) {
        this.body = 'from users list GET';
        yield next;
      });
      .put(function * (next) {
        this.body = 'from users list PUT';
        yield next;
      });
  });

app.listen(4000);
```

As you can see, you can pass classic ``express`` route style, such as ``/user/:id``, and after that you can read received values from ``this.request.params`` object.

### Example 2

You can pass also regex as route path. In following example we will see how you can do that, and also separate route handlers among multiple files.

**app.js**
```
var koa = require('koa'),
  routing = require('koa-routing');

var app = module.exports = koa();
app.use(routing(app));
require('./users-api');

app.listen(4000);
```

**users-api.js**
```
'use strict';

var app = require('./app'),
  profileApi = require('./profile-api'),
  // declare /user route
  usersApi = app.route(/\/user\/?/);

usersApi.get(function * (next) {
  this.body = 'from get';
  yield next;
});

usersApi.post(function * (next) {
  this.body = 'from post';
  yield next;
});

usersApi.put(function * (next) {
  this.body = 'from put';
  yield next;
});

// declare /user/profile route
usersApi.nested(/\/profile/, profileApi);
module.exports = usersApi;
```

**profile-api.js**
```
'use strict';

var getHandler = function * (next) {
  this.body = 'GET profile';
  yield next;
};

module.exports = function () {
  this
    .get(getHandler)
    .post(function * (next) {
      this.body = 'POST profile';
      yield next;
    });
};
```

Above examples are showing on which different ways you can structure your ``koa`` application with ``koa-routing``. It is up to you to take one approach and start coding your awesome app.

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
app.route('/api/users/profile')
.nested('/data', function () {
  // and then you define methods for that route
  this
  .get(function * (next) { yield next; });
  // here you can also define other HTTP operations, like POST, PUT, etc
  // example of put...
  .put(function * (next) { yield next; });
})
.nested('/image', function () {
  this
  .get(function * (next) { yield next; });
})
```

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

## Other features

#### Multiple middlewares

With ``koa-routing`` you can provide multiple middlewares for each route:
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

## Contributing

Feel free to send pull request with some new awesome feature or some bug fix.
But please provide some tests with your contribution.

# License
**MIT**

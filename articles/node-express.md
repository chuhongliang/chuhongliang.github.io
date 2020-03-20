# express4.0源码解析

express4.x 去除了connect的依赖，3.x基于connect的中间件基本全都不能用。需要手动安装依赖包或者用一些其它的中间件。

## 入口函数: createApplication()
```js
var mixin = require('merge-descriptors');
var proto = require('./application');

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}
```
首先把事件的全部属性mix进app里，给app增加事件功能。

然后把application模块的全部属性mix进app里。

接着把req，res模块分别赋值给app, 这样this是可以直接调用request，response，

最后具体执行过程是在app.init()函数里面。

## app.init()
```js
app.init = function init() {
  this.cache = {};
  this.engines = {};
  this.settings = {};

  this.defaultConfiguration();
};
```

这里app对象增加了三个属性cache、engines、settings,然后调用了defaultConfiguration()函数。

## defaultConfiguration()
这个函数比较长，我们逐行分析：
```js
this.enable('x-powered-by');
...
app.enable = function enable(setting) {
  return this.set(setting, true);
};
```
enable函数里调用了set函数，set函数的第二个参数为Boolean类型; set函数里操作的对象是上面app新增的三个属性之一的settings对象，其实就是为settings对象设置属性。

即设置x-powered-by 为true

x-powered-by 是http请求时返回的响应头信息，会返回相应的服务器信息。对于网站来说暴露信息过多，是不安全的;

```js
this.set('etag', 'weak');
```

这里处理etag的 Express依赖了一个叫etag的包

```js
var env = process.env.NODE_ENV || 'development';
this.set('env', env);
this.set('query parser', 'extended');
this.set('subdomain offset', 2);
this.set('trust proxy', false);
```

这里继续设置属性

```js
this.on('mount', function onmount(parent) {
    // inherit trust proxy
    if (this.settings[trustProxyDefaultSymbol] === true
      && typeof parent.settings['trust proxy fn'] === 'function') {
      delete this.settings['trust proxy'];
      delete this.settings['trust proxy fn'];
    }

    // inherit protos
    setPrototypeOf(this.request, parent.request)
    setPrototypeOf(this.response, parent.response)
    setPrototypeOf(this.engines, parent.engines)
    setPrototypeOf(this.settings, parent.settings)
  });
```
这里是用来挂载子应用的，可以监听同一个端口，转发给子应用

下面是官方例子:
```js
var admin = express()

admin.on('mount', function (parent) {
  console.log('Admin Mounted')
  console.log(parent) // refers to the parent app
})

admin.get('/', function (req, res) {
  res.send('Admin Homepage')
})

app.use('/admin', admin)
```

初始化流程到这里就结束了，下面我们来看看app.use()函数

## app.use()
注释中写道:'Proxy `Router#use()` to add middleware to the app router' 向路由添加中间件
```js
app.use = function use(fn) {
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate app.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  var fns = flatten(slice.call(arguments, offset));

  if (fns.length === 0) {
    throw new TypeError('app.use() requires a middleware function')
  }

  // setup router
  this.lazyrouter();
  var router = this._router;

  fns.forEach(function (fn) {
    // non-express app
    if (!fn || !fn.handle || !fn.set) {
      return router.use(path, fn);
    }

    debug('.use app under %s', path);
    fn.mountpath = path;
    fn.parent = this;

    // restore .app property on req and res
    router.use(path, function mounted_app(req, res, next) {
      var orig = req.app;
      fn.handle(req, res, function (err) {
        setPrototypeOf(req, orig.request)
        setPrototypeOf(res, orig.response)
        next(err);
      });
    });

    // mounted an app
    fn.emit('mount', this);
  }, this);

  return this;
};
```
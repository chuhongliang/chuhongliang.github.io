# Async 模块源码解析 
Async模块最初设计用于Node.js解决回调函数嵌套，和异步流程控制。但它也可以直接在浏览器中使用，是早期JavaScript异步编程解决方案之一。

为了更好的理解JavaScript的异步编程，特地看了async模块的最初版本0.1.24的源码。特此记录！

下面逐步分析几个常用的方法:
- [series(tasks,[callback])](#series(tasks,[callback]))
- [waterfall(tasks,[callback])](#waterfall(tasks,[callback]))
- parallel(tasks,[callback]): 并行执行，相互无关联
- whilst(test,fn,[callback]): 循环执行,fn函数里不管是同步还是异步都会执行完上一次循环才会执行下一次循环,

## series(tasks,[callback])
>串行执行，相互无关联

首先我们先看async.series函数代码:
```js
async.series = function (tasks, callback) {
    callback = callback || function () { };
    if (_isArray(tasks)) {
        async.mapSeries(tasks, function (fn, callback) {
            if (fn) {
                fn(function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    callback.call(null, err, args);
                });
            }
        }, callback);
    }else {
        var results = {};
        async.eachSeries(_keys(tasks), function (k, callback) {
            tasks[k](function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                results[k] = args;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }
};
```
先判断了一下tasks是否是数组，如果是数组则调用async.mapSeries函数，async.mapSeries指向了doSeries函数, 同时将_asyncMap函数作为参数传入:
```js
async.mapSeries = doSeries(_asyncMap);
var doSeries = function (fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return fn.apply(null, [async.eachSeries].concat(args));
    };
};
```
doSeries中将async.eachSeries作为参数合并传入并调用了_asyncMap函数，其作用等效于以下写法:
```js
var doSeries = function (_asyncMap) {
    return function (arr, iterator, callback) {
        return _asyncMap(async.eachSeries, arr, iterator, callback);
    };
};
```

_asyncMap中先将arr数组包装成了key,value键值对数组作为参数传入async.eachSeries函数，
```js
var _asyncMap = function (eachfn, arr, iterator, callback) {
    arr = _map(arr, function (x, i) {
        return { index: i, value: x };
    });
    if (!callback) {
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err) {
                callback(err);
            });
        });
    } else {
        var results = [];
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }
};
```

async.eachSeries中代码不难理解，主要是递归调用iterate函数，然后依次将arr中的函数传入iterator并执行。
```js
async.eachSeries = function (arr, iterator, callback) {
    callback = callback || function () { };
    if (!arr.length) {
        return callback();
    }
    var completed = 0;
    var iterate = function () {
        iterator(arr[completed], function (err) {
            if (err) {
                callback(err);
                callback = function () { };
            }else {
                completed += 1;
                if (completed >= arr.length) {
                    callback();
                }else {
                    iterate();
                }
            }
        });
    };
    iterate();
};
```

## waterfall(tasks,[callback])
>串行执行，前一个函数的输出为后一个函数的输入
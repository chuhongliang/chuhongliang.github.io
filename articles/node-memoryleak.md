# 内存泄漏
>Node对内存泄漏十分敏感，一旦线上应用流量千万级别，哪怕一个字节的内存泄漏也会造成堆积，垃圾回收过程中将会耗费更多时间进行对象描述，应用响应缓慢，直到进程内存溢出，应用崩溃。

### 在V8的垃圾回收机制下，在通常的代码编写中，很少会出现内存泄漏的情况。但是内存泄漏通常产生于无意间，较难排查。尽管内存泄漏的情况不尽相同，但其实质只有一个，那就是应当回收的对象出现意外而没有被回收，变成了常驻在老生代中的对象。通常，造成内存泄漏的原因有如下几个。
* 缓存；
* 队列消费不及时；
* 作用域未释放。

## 慎将内存当作缓存
缓存访问效率要比I/O的效率高，一旦命中缓存，就可以节省一次I/O的时间。在Node中，一个对象被当作缓存使用时，将会常驻在老生代中。缓存中存储的键越多，长期存活的对象也就越多，这将导致垃圾回收在进行扫描和整理时，对这些对象无法回收。

另一个问题，js开发者喜欢用对象的键值对来缓存东西，这与严格意义上的缓存有区别，严格意义的缓存有完善的过期策略，而普通对象的键值对没有。

下面代码虽然利用JS对象创建一个缓存对象，但是受垃圾回收机制的影响，只能小量使用：
```js
var cache = {};
var get = function(key) {
  if (cache[key]) {
    return cache[key];
  } else {
    // get from otherwise
  }
};
var set = function (key, value) {
  cache[key] = value;
};
```
上述示例，只要限定缓存对象的大小，加上完善的过期策略以防止内存无限制增长，可以用。

以下是一个可能无意识造成内存泄漏的场景：memoize。underscore对memoize的实现：
```js
_.memoize = function(func, hasher) {
  var memo = {};
  hasher || (hasher = _.identity);
  return function() {
    var key = hasher.apply(this, arguments);
    return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
  };
};
```
它的原理是以参数作为键进行缓存，以内存空间换CPU执行时间。这里潜藏的陷阱即是每个被执行的结果都会按参数缓存在memo对象上，不会被清除。这在前端网页这种短时应用场景中不存在大问题，但是执行量大和参数多样性的情况下，会造成内存占用不释放。

所以在Node中，任何试图拿内存当缓存的行为要小心使用。

### 缓存限制策略
为了解决缓存中的对象永远无法释放的问题，需要加入一种策略来限制缓存的无限增长。可以自己编写一个模块实现对键值对数量的限制，示例代码：

```js
var LimitableMap = function(limit) {
  this.limit = limit || 10;
  this.map = {};
  this.keys = [];
};
var hasOwnProperty = Object.prototype.hasOwnProperty;
LimitableMap.prototype.set = function(key, value) {
  var map = this.map;
  var keys = this.keys;
  if (!hasOwnProperty.call(map, key)) {
    if (keys.length === this.limit) {
      var firstKey = keys.shift();
      delete map[firstKey];
    }
    keys.push(key);
  }
  map[key] = value;
};
LimitableMap.prototype.get = function (key) {
  return this.map[key];
};
```

记录键在数组中，一旦超过数量，就以先进先出的方式进行淘汰。 这种淘汰策略并不是十分高效，只能应付小型应用场景。如果需要更高效的缓存，可以采用LRU算法的缓存，有限制的缓存，memoize还是可用。

为了加速模块的引入，所有模块都会通过编译执行，然后被缓存起来。通过exports导出的函数，可以访问文件模块中的私有变量，这样每个文件模块在编译执行后形成的作用域因为模块缓存的原因，不会被释放。示例代码：

```js
(function(exports, require, module, __filename, __dirname) {
  var local = "局部变量";
  exports.get = function() {
    return local;
  };
});
```

由于模块的缓存机制，模块是常驻老生代的，在设计模块时，要十分小心内存泄漏的出现，在下面的代码，每次调用leak()方法时，都导致局部变量leakArray不停增加内存的占用，且不被释放：

```js
var leakArray = [];
exports.leak = function() {
  leakArray.push("leak" + Math.random());
};
```

如果模块需要这么设计，那么请添加清空队列的相应接口，供调用者释放内存。

### 缓存解决方案
直接将内存作为缓存方案要十分谨慎，除了限制缓存的大小，另外要考虑的是，进程之间无法共享内存。如果在进程内使用缓存，这些缓存不可避免地有重复，对物理内存的使用是一种浪费。

如果使用大量缓存，目前比较好的解决方案是采用进程外的缓存，进程自身不存储状态。外部的缓存软件有良好的缓存过期淘汰策略以及自有的内存管理，不影响Node进程的性能，在Node中主要可以解决一下两个问题：
- 将缓存转移到外部，减少常驻内存的对象的数量，让垃圾回收更高效；
- 进程之间可以共享缓存。

目前，市面上比较好的缓存有Redis和Memcached。
- Redis：https://github.com/mranney/node_redis。
- Memcached：https://github.com/3rd-Eden/node-memcached。

## 关注队列状态
内存泄漏的另一个情况则是队列。在js中可以通过队列（数组对象）来完成许多特殊的需求，比如Bagpipe。队列在消费者-生产者模型中经常充当中间产物。在大多数应用场景下，消费的速度远大于生产的速度，内存泄漏不易产生，但是一旦消费速度低于生产速度，将会形成堆积。

举个例子，有的应用会收集日志。如果欠缺考虑，也许会采用数据库来记录日志。日志通常会是海量的，数据库构建在文件系统之上，写入效率远远低于文件直接写入，于是会形成数据库写入操作的堆积，而js相关作用域也不会得到释放，内存占用不会回落，从而出现内存泄漏。

遇到这种场景，表层解决方案是换用消费速度更高的技术。在日志收集的案例中，换用文件写入日志的方式会更高效。需要注意的是，如果生产速度因为某些原因突然激增，或者消费速度因为突然的系统故障降低，内存泄漏还是可能出现的。

深度的解决方案应该是监控队列的长度，一旦堆积，应当通过监控系统产生报警并通知相关人员。另一个解决方案是任意异步调用都应该包含超时机制，一旦在限定的时间内未完成响应，通过回调函数传递超时异常，使得任意异步调用的回调都具备可控的响应时间，给消费速度一个下限值。

对于Bagpipe而言，它提供了超时模式和拒绝模式。启用超时模式时，调用加入到队列中就开始计时，超时就直接响应一个超时错误。启用拒绝模式时，当队列拥塞时，新到来的调用会直接响应拥塞错误。这两种模式都能够有效地防止队列拥塞导致的内存泄漏问题。

---
# 内存泄漏排查
>在Node中，由于V8的堆内存大小的限制，它对内存泄漏非常敏感。当在线服务的请求量变大时，哪怕是一个字节的泄漏都会导致内存占用过高。下面介绍一下遇到内存泄漏时的排查方案。

### 有一些常见的工具来定位Node应用的内存泄漏
- v8-profiler：它可以用于对V8堆内存抓取快照和对CPU进行分析；
- node-heapdump：它允许对V8堆内存抓取快照，用于事后分析；
- node-mtrace：它使用GCC的mtrace工具来分析堆的使用；
- dtrace：有完善的dtrace工具用来分析内存泄漏；
- node-memwatch：来自Mozilla贡献的模块，采用WTFPL许可发布。

## node-heapdump
想要了解node-heapdump对内存泄漏进行排查的方式，需要先构造如下一份包含内存泄漏的代码示例，并将其存为server.js文件：
```js
var leakArray = [];
var leak = function() {
  leakArray.push("leak" + Math.random());
};
http.createServer(function (req, res) {
  leak();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');
```

在上面这段代码中，每次访问服务进程都将引起leakArray数组中的元素增加，而且得不到回收。我们可以用curl工具输入http://127.0.0.1:1337/命令来模拟用户访问。

### 安装node-heapdump
```js
npm install heapdump
```

### 引入node-heapdump
```js
var heapdump = require('heapdump');
```
引入node-heapdump后，访问多次，leakArray就会具备大量的元素。这个时候我们通过向服务进程发送SIGUSR2信号，让node-heapdump抓拍一份堆内存的快照。发送信号的命令如下：
```js
kill -USR2 <pid>
```
这份抓取的快照将会在文件目录下以heapdump-<sec>.<usec>.heapsnapshot的格式存放。这是一份较大的JSON文件，需要通过chrome的开发者工具打开查看。

在chrome的开发者工具中选中Profiles面板，右击该文件后，从弹出的快捷菜单中选择Load...选项，打开刚才的快照文件，就可以查看堆内存中的详细信息。

## node-memwatch
准备一份内存泄漏代码：

```js
var memwatch = require('memwatch');
memwatch.on('leak', function(info) {
  console.log('leak:');
  console.log(info);
});
memwatch.on('stats', function(stats) {
  console.log('stats:');
  console.log(stats);
});
var http = require('http');
var leakArray = [];
var leak = function() {
  leakArray.push("leak" + Math.random());
};
http.createServer(function(req, res) {
  leak();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337);
console.log('Server running at http://127.0.0.1:1337/');
```

## stats事件
在进程中使用node-memwatch之后，每次进行全堆垃圾回收时，将会触发一次stats事件，这个事件将会传递内存的统计信息。在对上述代码创建的服务进程进行访问时，某次stats事件打印的数据如下所示，其中每项的意义卸载注释中：

```js
stats:{
  num_full_gc: 4, // 第几次全堆垃圾回收
  num_inc_gc: 23, // 第几次增量垃圾回收
  heap_compactions: 4, // 第几次对老生代进行整理
  usage_trend: 0, // 使用趋势
  estimated_base: 7152944, // 预估基数
  current_base: 7152944, // 当前基数
  min: 6720776, // 最小
  max: 7152944 // 最大
}
```
在这些数据中，num_full_gc和num_inc_gc比较直观地反应了垃圾回收的情况。

## leak事件
如果经过连续5次垃圾回收后，内存仍然没有被释放，这意味着有内存泄漏的产生，node-memwatch会触发一个leak事件。某次leak事件得到的数据如下所示：

```js
  leak:{
  start: Mon Oct 07 2013 13:46:27 GMT+0800 (CST),
  end: Mon Oct 07 2013 13:54:40 GMT+0800 (CST),
  growth: 6222576,
  reason: 'heap growth over 5 consecutive GCs (8m 13s) - 43.33 mb/hr'
}
```
这个数据能显示5次垃圾回收的过程中内存增长了多少。

## 堆内存比较
最终得到的leak事件的信息只能告知我们应用中存在内存泄漏，具体问题产生在何处还需要从V8的堆内存上定位。node-memwatch提供了抓取快照和比较快照的功能，它能够比较堆上对象的名称和分配数量，从而找到导致内存泄漏的元凶。

下面为一段导致内存泄漏的代码，这是通过node-memwatch获取堆内存差异结果的示例：
```js
var memwatch = require('memwatch');
var leakArray = [];
var leak = function() {
  leakArray.push("leak" + Math.random());
};
    
// Take first snapshot
var hd = new memwatch.HeapDiff();
    
for (var i = 0; i < 10000; i++) {
  leak();
}

// Take the second snapshot and compute the diff
var diff = hd.end();
console.log(JSON.stringify(diff, null, 2));
```
执行node diff.js，得到的输出结果如下所示：

```js
{
	"before": {
		"nodes": 11719,
		"time": "2013-10-07T06:32:07.000Z",
		"size_bytes": 1493304,
		"size": "1.42 mb"
	},
	"after": {
		"nodes": 31618,
		"time": "2013-10-07T06:32:07.000Z",
		"size_bytes": 2684864,
		"size": "2.56 mb"
	},
	"change": {
		"size_bytes": 1191560,
		"size": "1.14 mb",
		"freed_nodes": 129,
		"allocated_nodes": 20028,
		"details": [{
				"what": "Array",
				"size_bytes": 323720,
				"size": "316.13 kb",
				"+": 15,
				"-": 65
			},
			{
				"what": "Code",
				"size_bytes": -10944,
				"size": "-10.69 kb",
				"+": 8,
				"-": 28
			},
			{
				"what": "String",
				"size_bytes": 879424,
				"size": "858.81 kb",
				"+": 20001,
				"-": 1
			}
		]
	}
}
```

在上面的输出结果中，主要关注change节点下的freed_nodes和allocated_nodes，他们记录了释放的，它们记录了释放的节点数量和分配的节点数量。这里由于有内存泄漏，分配的节点数量远远多于释放的节点数量。在details下可以看到具体每种类型的分配和释放数量，主要问题展现在下面这段输出中：
```js
{
    "what": "String",
    "size_bytes": 879424,
    "size": "858.51 kb",
    "+": 20001,
    "-": 1
}
```
在上述代码中，加号和减号分别表示分配和释放的字符串对象数量。可以通过上面的输出结果猜测到，有大量的字符串没有被回收。

### 排查内存泄漏的原因主要通过对堆内存进行分析而找到。node-heapdump和node-memwatch各有所长。

# 大内存应用
在Node中，不可避免地还是会存在操作大文件的场景。由于Node的内存限制，不过Node提供了stream模块用于处理大文件。

### stream模块是Node的原生模块，直接引用即可。stream继承自EventEmitter，具备基本的自定义事件功能，同时抽象出标准的事件和方法。它分可读和可写两种。Node中的大多数模块都有stream的应用，比如fs的createReadStream()和createWriteStream()方法可以分别用于创建文件的可读流与可写流，process模块中的stdin和stdout则分别是可读流和可写流的示例。

### 由于V8的内存限制，我们无法通过fs.readFile()和fs.writeFile()直接进行大文件的操作，而改用fs.createReadStream()和fs.createWriteStream()方法通过流的方式实现对大文件的操作。

下面的代码展示了如何读取一个文件，然后将数据写入到另一个文件的过程：

```js
var reader = fs.createReadStream('in.txt');
var writer = fs.createWriteStream('out.txt');
reader.on('data', function (chunk) {
  writer.write(chunk);
});
reader.on('end', function () {
  writer.end();
});
```
可读流提供了管道方法pipe()，封装了data事件和写入操作。通过流的方式，上述代码不会受到V8内存限制的影响，有效地提高了程序的健壮性。

如果不需要进行字符串层面的操作，则不需要借助V8来处理，可以尝试进行纯粹的Buffer操作，这不会受到V8堆内存的限制。但是这种大片使用内存的情况依然要小心，即使V8不限制堆内存的大小，物理内存依然有限制。
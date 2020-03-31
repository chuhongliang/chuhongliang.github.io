
Node.js采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现。

在Node.js启动的时候，它会初始化EventLoop，处理程序代码，可能是调用异步API、定时器或者调用process.nextTick()，然后开始事件轮询。

#### 根据Node.js官方介绍，每次事件循环都包含了6个阶段，对应到 libuv 源码中的实现，如下图所示

```txt
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```
- ```timers``` 阶段: 这个阶段执行setTimeout(callback) and setInterval(callback)预定的callback;
- ```I/O callbacks``` 阶段: 执行除了 close事件的callbacks、被timers(定时器，setTimeout、- setInterval等)设定的callbacks、setImmediate()设定的callbacks之外的callbacks;
- ```idle, prepare``` 阶段: 仅node内部使用;
- ```poll``` 阶段: 获取新的I/O事件, 适当的条件下node将阻塞在这里;
- ```check``` 阶段: 执行setImmediate() 设定的callbacks;
- ```close``` callbacks 阶段: 比如socket.on(‘close’, callback)的callback会在这个阶段执行.
  
#### 每一个阶段都有一个装有callbacks的fifo queue(队列)，当event loop运行到一个指定阶段时，node将执行该阶段的fifo queue(队列)，当队列callback执行完或者执行callbacks数量超过该阶段的上限时，event loop会转入下一下阶段.


## ``timers`` 阶段
timers 是事件循环的第一个阶段，Node 会去检查有无已过期的timer，如果有则把它的回调压入timer的任务队列中等待执行，事实上，Node 并不能保证timer在预设时间到了就会立即执行，因为Node对timer的过期检查不一定靠谱，它会受机器上其它运行程序影响，或者那个时间点主线程不空闲。
  
比如下面的代码，setTimeout() 和 setImmediate() 的执行顺序是不确定的
```js
setTimeout(() => {
  console.log('timeout')
}, 0)
setImmediate(() => {
  console.log('immediate')
})
```
但是把它们放到一个I/O回调里面，就一定是 setImmediate() 先执行，因为poll阶段后面就是check阶段。


## ```poll``` 阶段
### poll 阶段主要有2个功能：
- 处理 poll 队列的事件
- 当有已超时的 timer，执行它的回调函数

#### event-loop将同步执行poll队列里的回调，直到队列为空或执行的回调达到系统上限（上限具体多少未详），接下来even loop会去检查有无预设的setImmediate()，分两种情况：

- 若有预设的setImmediate(), event loop将结束poll阶段进入check阶段，并执行check阶段的任务队列
- 若没有预设的setImmediate()，event loop将阻塞在该阶段等待
  
注意一个细节，没有setImmediate()会导致event loop阻塞在poll阶段，这样之前设置的timer岂不是执行不了了？所以咧，在poll阶段event loop会有一个检查机制，检查timer队列是否为空，如果timer队列非空，event loop就开始下一轮事件循环，即重新进入到timer阶段。


## ``check`` 阶段
setImmediate()的回调会被加入check队列中， 从event loop的阶段图可以知道，check阶段的执行顺序在poll阶段之后。


## ``process.nextTick``
process.nextTick() 会在各个事件阶段之间执行，一旦执行，要直到nextTick队列被清空，才会进入到下一个事件阶段，所以如果递归调用 process.nextTick()，会导致出现I/O starving（饥饿）的问题，比如下面例子的readFile已经完成，但它的回调一直无法执行：

```js
const fs = require('fs')
const starttime = Date.now()
let endtime
fs.readFile('text.txt', () => {
  endtime = Date.now()
  console.log('finish reading time: ', endtime - starttime)
})
let index = 0
function handler () {
  if (index++ >= 1000) return
  console.log(`nextTick ${index}`)
  process.nextTick(handler)
  // console.log(`setImmediate ${index}`)
  // setImmediate(handler)
}
handler()
```

process.nextTick()的运行结果：
```js
nextTick 1
nextTick 2
......
nextTick 999
nextTick 1000
finish reading time: 170
```

替换成setImmediate()，运行结果：
```js
setImmediate 1
setImmediate 2
finish reading time: 80
......
setImmediate 999
setImmediate 1000
```
这是因为嵌套调用的 setImmediate() 回调，被排到了下一次event loop才执行，所以不会出现阻塞。


## 总结

- Node.js 的事件循环分为6个阶段
- 浏览器和Node 环境下，microtask 任务队列的执行时机不同
- Node.js中，microtask 在事件循环的各个阶段之间执行
- 浏览器端，microtask 在事件循环的 macrotask 执行完之后执行
- 递归的调用process.nextTick()会导致I/O starving，官方推荐使用setImmediate()


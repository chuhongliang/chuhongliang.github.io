### 1. Micro-Task 与 Macro-Task

> 事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。宏任务队列可以有多个，微任务队列只有一个。

- 常见的 macro-task（宏任务） 比如：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。
- 常见的 micro-task（微任务） 比如: process.nextTick、new Promise().then(回调)、MutationObserver(html5 新特性) 等。
- 宏任务每次执行一个，微任务每次执行队列里所有的，直到微任务队列为空

&nbsp;

### 2. Event Loop 过程解析
- 一开始执行栈空,我们可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则。micro 队列空，macro 队列里有且只有一个 script 脚本（整体代码）。

- 全局上下文（script 标签）被推入执行栈，同步代码执行。在执行的过程中，会判断是同步任务还是异步任务，通过对一些接口的调用，可以产生新的 macro-task 与 micro-task，它们会分别被推入各自的任务队列里。同步代码执行完了，script 脚本会被移出 macro 队列，这个过程本质上是队列的 macro-task 的执行和出队的过程。

- 上一步我们出队的是一个 macro-task，这一步我们处理的是 micro-task。但需要注意的是：当 macro-task 出队时，任务是一个一个执行的；而 micro-task 出队时，任务是一队一队执行的。因此，我们处理 micro 队列这一步，会逐个执行队列中的任务并把它出队，直到队列被清空。

- 执行渲染操作，更新界面
- 检查是否存在 Web worker 任务，如果有，则对其进行处理
- 上述过程循环往复，直到两个队列都清空
  
> 当某个宏任务执行完后,会查看是否有微任务队列。如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务，执行宏任务的过程中，遇到微任务，依次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推。

下面看一段代码:
``` javascript
function test() {
  console.log('script start');
  setTimeout(function () {
    console.log('timeout1');
    new Promise(function (reslove) {
      console.log('promise2');
      reslove();
    }).then(function () {
      console.log('then2')
    });
    new Promise(function (reslove) {
      console.log('promise3');
      reslove();
    }).then(function () {
      console.log('then3')
    });
  });
  setTimeout(function () {
    console.log('timeout2');
  });
  new Promise(resolve => {
    console.log('promise1');
    resolve();
    setTimeout(() => console.log('timeout3'), 10);
  }).then(function () {
    console.log('then1')
  })
  console.log('script end');
}
test();
```

执行结果：

``` js
script start   promise1   script end
then1
timeout1
promise2  promise3
then2  then3
timeout2
timeout3
```

注：同步代码包括 console.log，Promise的创建也属于同步代码

- 执行同步代码，输出script start，生成宏任务setTimeout1，setTimeout2, 
- 执行同步代码，输出promise1，生成宏任务setTimeout3, 生成微任务then1，
- 执行同步代码，输出script end
- 所有的同步代码执行完后，执行栈为空，查询是否有异步代码需要执行
- 首先会执行微任务，进入Promise1，执行resolve，在第一个then回调中打印出then1
- 微任务队列空
- 执行宏任务务队列，取出setTimeout1执行，输出timeout1
- 执行同步代码，输出promise2，生成微任务then2，
- 执行同步代码，输出promise3，生成微任务then3，
- 执行微任任务队列，输出then2、then3，微任务队列空
- 接下来执行剩下的两个宏任务，依次输出 timeout2，timeout3

                    
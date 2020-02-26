JavaScript 中有一个特殊的对象，称为全局对象（Global Object），它及其所有属性都可以在程序的任何地方访问，即全局变量。
在浏览器 JavaScript 中，通常 window 是全局对象， 而 Node.js 中的全局对象是 global，所有全局变量（除了 global 本身以外）都是 global 对象的属性。

>在 Node.js 我们可以直接访问到 global 的属性，而不需要在应用中包含它。

Node.js中的内置全局对象
- [console](#console)
- [__filename](#filename)
- [__dirname](#dirname)
- [setTimeout(cb, ms)](#settimeoutcb-ms)
- [clearTimeout(t)](#cleartimeoutt)
- [setInterval(cb, ms)](#setintervalcb-ms)
- [setImmediate](#setimmediate)
- [process](#process)
- [exports](#exports)
- [module.exports](#moduleexports)
- [require(id)](#requireid)

---

## console
console 用于提供控制台标准输出，它是由 Internet Explorer 的 JScript 引擎提供的调试工具，后来逐渐成为浏览器的实施标准。
Node.js 沿用了这个标准，提供与习惯行为一致的 console 对象，用于向标准输出流（stdout）或标准错误流（stderr）输出字符。

常用方法:
- console.log([data][, ...])  普通日志
- console.info([data][, ...]) 信息日志
- console.warn([data][, ...]) 警告日志
- console.error([data][, ...]) 错误日志
- console.trace(message[, ...]): 当前执行的代码在堆栈中的调用路径

---

## __filename
__filename 表示当前正在执行的脚本的文件名。它将输出文件所在位置的绝对路径，且和命令行参数所指定的文件名不一定相同。 如果在模块中，返回的值是模块文件的路径。

```js
// 输出全局变量 __filename 的值
console.log( __filename );
```
---

## __dirname
__dirname 表示当前执行脚本所在的目录。

```js
// 输出全局变量 __dirname 的值
console.log( __dirname );
```
---

## setTimeout(cb, ms)
setTimeout(cb, ms) 全局函数在指定的毫秒(ms)数后执行指定函数(cb)。：setTimeout() 只执行一次指定函数。
返回一个代表定时器的句柄值。

```js
// 两秒后执行以下函数
setTimeout(function printHello(){
   console.log( "Hello, World!");
}, 2000);
```

---

## clearTimeout(t)
clearTimeout( t ) 全局函数用于停止一个之前通过 setTimeout() 创建的定时器。 参数 t 是通过 setTimeout() 函数创建的定时器。

```js
let t = setTimeout(function printHello(){
   console.log( "Hello, World!");
}, 2000);
// 清除定时器
clearTimeout(t);
```
---

## setInterval(cb, ms)
setInterval(cb, ms) 全局函数在指定的毫秒(ms)数后执行指定函数(cb)。
返回一个代表定时器的句柄值。可以使用 clearInterval(t) 函数来清除定时器。
setInterval() 方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。

```js
// 两秒后执行以下函数
setInterval(function printHello(){
   console.log( "Hello, World!");
}, 2000);
```

## setImmediate
预定在 I/O 事件的回调之后立即执行的 callback。
```js
// 两秒后执行以下函数
setImmediate(function printHello(){
   console.log( "Hello, World!");
}, 2000);
```

## process
process 对象是一个全局变量，它提供有关当前 Node.js 进程的信息并对其进行控制。 作为一个全局变量，它始终可供 Node.js 应用程序使用，无需使用 require()。 

## exports
这是一个对于 module.exports 的更简短的引用形式。查看关于 exports 快捷方式的章节，详细了解什么时候使用 exports、什么时候使用 module.exports。

## module.exports
用于指定一个模块所导出的内容，即可以通过 require() 访问的内容。

## require(id)
用于引入模块、 JSON、或本地文件。 可以从 node_modules 引入模块。 可以使用相对路径（例如 ./、 ./foo、 ./bar/baz、 ../foo）引入本地模块或 JSON 文件，路径会根据 __dirname 定义的目录名或当前工作目录进行处理。
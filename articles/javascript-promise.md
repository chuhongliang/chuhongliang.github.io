# Promise 
Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

## Promise对象有以下两个特点。
- 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise对象提供统一的接口，使得控制异步操作更加容易。

Promise也有一些缺点。首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

> 以上摘自[ECMAScript 6 入门](https://es6.ruanyifeng.com/#docs/promise)

---

# Promise标准
Promise 规范有很多，如Promise/A，Promise/B，Promise/D 以及 Promise/A 的升级版 Promise/A+。ES6 中采用了 Promise/A+ 规范。

英文版规范: [Promises/A+规范](https://promisesaplus.com/)

中文版规范: [Promises/A+规范(中文)](https://www.ituring.com.cn/article/66566)

---

# Promise 原理与实现
## 构造函数
```js
function Promise(executor){};
```

## 原型方法
```js
Promise.prototype.then = function() {}
Promise.prototype.catch = function() {}
```

## 静态方法
```js
Promise.resolve = function() {}
Promise.reject = function() {}
Promise.all = function() {}
Promise.race = function() {}
```

## Promise实现原理:
- 构造函数接收一个executor立即执行函数
- executor立即执行函数接收两个参数resolve, reject
- promise对象的then方法绑定状态变为fulfilled时的回调
- resolve函数被调用时会触发then方法中的回调
- reject函数被调用时会触发catch方法中的回调

### 下面为代码实现:
```js
const PENDING = 'pending';
const RESOLEVED = 'resolved';
const REJECTED = 'rejected';

function Promise(executor) {
	const self = this;
	self.state = PENDING;
	self.data = undefined; //promise的值
	self.resolvedCallback = [];
	self.rejectedCallback = [];

	function resolve(value) {
		if (self.status === PENDING) {
			self.status = RESOLEVED;
			self.data = value;
			self.resolvedCallback.forEach(function (callback) {
				callback(value);
			});
		}
	}

	function reject(reason) {
		if (self.status === PENDING) {
			self.status = REJECTED;
			self.data = reason;
			self.rejectedCallback.forEach(function (callback) {
				callback(reason);
			});
		}
	}

	try {
		executor(resolve, reject);
	} catch (e) {
		// 执行器出现错误需要reject
		reject(e)
	}
}

Promise.prototype.then = function (onFulfilled, onRejected) {
	const { state, value, resolvedCallback, rejectedCallback } = this;
	return new Promise((resolveNext, rejectNext) => {
		const resolvePromise = value => {
			try {
				// 正常情况
				if (typeof onFulfilled !== 'function') {
					// 不是函数，直接忽略，将then所属的promise作为then返回的promise的值resolve来做到值的传递
					resolveNext(value)
				} else {
					// 获取then函数回调的执行结果
					const res = onFulfilled(value)
					if (res instanceof NewPromise) {
						// 当执行结果返回的是一个promise实例，等待这个promise状态改变后再改变then返回的promise的状态
						res.then(resolveNext, rejectNext)
					} else {
						// 当返回值是普通值，将其作为新promise的值resolve
						resolveNext(res)
					}
				}
			} catch (e) {
				// 出现异常，新promise的状态变为rejected，reason就是错误对象
				rejectNext(e)
			}
		}
		const rejectPromise = reason => {
			try {
				// 正常情况
				if (typeof onRejected !== 'function') {
					// 不是函数，直接忽略，将then所属的promise作为then返回的promise的值reject来做到值的传递
					rejectNext(reason)
				} else {
					// 获取then函数回调的执行结果
					const res = onRejected(reason)
					if (res instanceof NewPromise) {
						// 当执行结果返回的是一个promise实例，等待这个promise状态改变后再改变then返回的promise的状态
						res.then(resolveNext, rejectNext)
					} else {
						// 当返回值是普通值，将其作为新promise的值reject
						rejectNext(res)
					}
				}
			} catch (e) {
				// 出现异常，新promise的状态变为rejected，reason就是错误对象
				rejectNext(e)
			}
		}
		if (state === PENDING) {
			resolvedCallback.push(resolvePromise)
			rejectedCallback.push(rejectPromise)
		}
		// 要保证在当前promise状态改变之后，再去改变新的promise的状态
		if (state === RESOLEVED) {
			resolvePromise(value)
		}
		if (state === REJECTED) {
			rejectPromise(value)
		}
	})
}

// 用then方法实现catch
Promise.prototype.catch = function (reject) {
  return this.then(null, reject);
}
```

### 加入异步机制:
```js
function resolve(value) {
	setTimeout(function () {
		if (self.status === PENDING) {
			self.status = RESOLEVED;
			self.data = value;
			self.resolvedCallback.forEach(function (callback) {
				callback(value);
			});
		}
	}, 0)
}

function reject(reason) {
	setTimeout(function () {
		if (self.status === PENDING) {
			self.status = REJECTED;
			self.data = reason;
			self.rejectedCallback.forEach(function (callback) {
				callback(reason);
			});
		}
	}, 0)
}
```

>实际上，真正的promise库不倾向于使用setTimeout。如果库是面向NodeJS的，它可能会使用process.nextTick，对于浏览器，它可能会使用新的setImmediate或setImmediate shim（目前只有IE支持setImmediate），或者可能是异步库，如Kris Kowal的asap（Kris Kowal还编写了Q，一个流行的promise库）

---

参考:[mattgreer](http://www.mattgreer.org/articles/promises-in-wicked-detail/)
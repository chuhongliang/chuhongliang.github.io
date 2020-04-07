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
		const resolvePromise = function (value) {
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
		const rejectPromise = function (reason) {
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

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise(executor) {
	this.state = PENDING;
	this.data = undefined;
	this.callbacks = [];

	const self = this;

	function resolve(value) {
		if (self.state !== PENDING) return;
		self.state = FULFILLED;
		self.data = value;
		setTimeout(() => {
			self.callbacks.forEach(callbacksObj => {
				callbacksObj.onFulfilled(value);
			});
		});
	}

	function reject(reason) {
		if (self.state !== PENDING) return;
		self.state = REJECTED;
		self.data = reason;
		setTimeout(() => {
			self.callbacks.forEach(callbacksObj => {
				callbacksObj.onRejected(reason);
			});
		});
	}

	try {
		executor(resolve, reject);
	} catch (error) {
		reject(error);
	}
}

Promise.prototype.then = function (onFulfilled, onRejected) {
	const self = this;

	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
	onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

	return new Promise((resolve, reject) => {

		function handle(cb) {
			try {
				let result = cb(self.data);
				if (result instanceof Promise) {
					result.then(resolve, reject);
				} else {
					resolve(result);
				}
			} catch (error) {
				reject(error);
			}
		}

		if (self.state === FULFILLED) {
			setTimeout(() => {
				handle(onFulfilled);
			})
		} else if (self.state === REJECTED) {
			setTimeout(() => {
				handle(onRejected);
			})
		} else {
			self.callbacks.push({
				onFulfilled(value) {
					handle(onFulfilled);
				},
				onRejected(reason) {
					handle(onRejected);
				}
			})
		}
	});
}

Promise.prototype.catch = function (onRejected) {
	return this.then(null, onRejected);
}

Promise.resolve = function (value) {
	return new Promise((resolve, reject) => {
		if (value instanceof Promise) {
			value.then(resolve, reject);
		} else {
			resolve(value);
		}
	});
}

Promise.reject = function (reason) {
	return new Promise((resolve, reject) => {
		reject(reason);
	});
}

Promise.all = function (promises) {
	const values = new Array(promises.length);
	let resolveCount = 0;
	return new Promise((resolve, reject) => {
		promises.forEach((p, index) => {
			p.then(
				value => {
					resolveCount++;
					values[index] = value;
					if (resolveCount === promises.length) {
						resolve(values);
					}
				},
				reject
			)
		});
	});
}

Promise.race = function (promises) {
	return new Promise((resolve, reject) => {
		promises.forEach((p) => {
			p.then(resolve, reject);
		});
	});
}
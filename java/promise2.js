var PENDING = 'pending';
var FULFILLED = 'fulfiled';
var REJECTED = 'rejected';

function NewPromise(handler) {
    this.state = PENDING;
    this.value = undefined;
    this.successCallback = [];
    this.failureCallback = [];
    try {
        handler(this.resolve.bind(this), this.reject.bind(this))
    } catch (e) {
        // 执行器出现错误需要reject
        this.reject(e)
    }
}

NewPromise.prototype.resolve = function (value) {
    if (this.state !== PENDING) return
    this.state = FULFILLED;
    this.value = value;
    var self = this;
    console.log('***************')
    // 规范中要求then中注册的回调以异步方式执行，保证在resolve执行所有的回调之前，
    // 所有回调已经通过then注册完成
    setTimeout(function () {
        console.log('successCallback=>', self.successCallback);
        self.successCallback.forEach(function (item) {
            console.log('resolve item=>', item);
            item(value)
        })
    })
}

NewPromise.prototype.reject = function (reason) {
    if (this.state !== PENDING) return
    this.state = REJECTED
    this.value = reason
    var self = this;
    setTimeout(function () {
        self.failureCallback.forEach(function (item) {
            item(reason)
        })
    })
}

NewPromise.prototype.then = function (onFulfilled, onRejected) {
    console.log('then');
    var state = this.state;
    var value = this.value;
    var self = this;
    return new NewPromise(function (resolveNext, rejectNext) {
        var resolveNewPromise = function (value) {
            try {
                // 正常情况
                if (typeof onFulfilled !== 'function') {
                    // 不是函数，直接忽略，将then所属的promise作为then返回的promise的值resolve来做到值的传递
                    resolveNext(value)
                } else {
                    // 获取then函数回调的执行结果
                    var res = onFulfilled(value)
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
        var rejectNewPromise = function (reason) {
            try {
                // 正常情况
                if (typeof onRejected !== 'function') {
                    // 不是函数，直接忽略，将then所属的promise作为then返回的promise的值reject来做到值的传递
                    rejectNext(reason)
                } else {
                    // 获取then函数回调的执行结果
                    var res = onRejected(reason)
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
        console.log('state=>', state);
        if (state === PENDING) {
            self.successCallback.push(resolveNewPromise)
            self.failureCallback.push(rejectNewPromise)
        }
        // 要保证在当前promise状态改变之后，再去改变新的promise的状态
        if (state === FULFILLED) {
            resolveNewPromise(value)
        }
        if (state === REJECTED) {
            rejectNewPromise(value)
        }
    })
}

module.exports = NewPromise;
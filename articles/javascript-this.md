javascript中this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁，实际上this的最终指向的是那个调用它的对象.

javascript有执行上下文windows,或者函数。当前如果执行的直接属于windows，则取得的是windows的上下文。
当前如果执行的是函数，取得的是函数的上下文

```js
function a(){
    var user = "追梦子";
    console.log(this.user); //undefined
    console.log(this); //Window
}
a();
```
按照我们上面说的this最终指向的是调用它的对象，这里的函数a实际是被Window对象所点出来的，下面的代码就可以证明。
```js
function a(){
    var user = "追梦子";
    console.log(this.user); //undefined
    console.log(this);　　//Window
}
window.a();
```
和上面代码一样吧，其实alert也是window的一个属性，也是window点出来的。

## 改变this指向
apply, call, bind

三者都可以把一个函数应用到其他对象上，注意不是自身对象．apply,call是直接执行函数调用，bind是绑定，执行需要再次调用．apply和call的区别是apply接受数组作为参数，而call是接受逗号分隔的无限多个参数列表，

```js
function Person() {
}
Person.prototype.sayName() { alert(this.name); }

letobj = {name: 'michaelqin'}; // 注意这是一个普通对象，它不是Person的实例

//apply
Person.prototype.sayName.apply(obj, [param1, param2, param3]);

// call
Person.prototype.sayName.call(obj, param1, param2, param3);

// bind
let sn = Person.prototype.sayName.bind(obj);
sn([param1, param2, param3]); // bind需要先绑定，再执行
sn(param1, param2, param3); // bind需要先绑定，再执行
```

## caller, callee和arguments的区别
caller,callee之间的关系就像是employer和employee之间的关系，就是调用与被调用的关系，二者返回的都是函数对象引用．arguments是函数的所有参数列表，它是一个类数组的变量．
```js
function parent(param1, param2, param3) {
	child(param1, param2, param3);
}

function child() {
	console.log(arguments); // { '0': 'mqin1', '1': 'mqin2', '2': 'mqin3' }
	console.log(arguments.callee); // [Function: child]
	console.log(child.caller); // [Function: parent]
}

parent('mqin1', 'mqin2', 'mqin3');
```
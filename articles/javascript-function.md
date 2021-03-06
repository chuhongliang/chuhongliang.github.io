## 匿名函数
匿名函数就是没有名字的函数

匿名函数的自我执行
``` javascript
(function(num){
  return num;
})(1) //1
```

## 闭包
闭包是可访问一个函数作用域里变量的函数，由于闭包作用域返回的局部变量资源不会被立刻销毁回收，所以可能会占用更多的内存。过度使用闭包会导致性能下降，建议在非常有必要的时候才使用闭包。

由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。

#### 所以，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

```js
function f1(){
  var n = 999;
  function f2(){
    alert(n);
  }
  return f2;
}
var result = f1();
result();//999

// **f2()** 就是闭包
```



## 闭包的使用场景
### 1. 计数器
``` javascript
function test1(){
  var a = 1;
  return function(){
    return ++a;
  }
}
var test2 = test1();

console.log(test2()); // 2
console.log(test2()); // 3
console.log(test2()); // 4

//不能这样写,这样外层函数每次也会执行，从而age每次都会初始化
console.log(test1()()); // 2
console.log(test1()()); // 2
console.log(test1()()); // 2
```

### 2. 循环中使用闭包
下例，循环中的每个迭代器在运行时都会给自己捕获一个i的副本，但是根据作用域的工作原理，尽管循环中的五个函数分别是在各个迭代器中分别定义的，但是它们都会被封闭在一个共享的全局作用域中，实际上只有一个i，结果每次都会输出6

``` javascript
for(var i=1; i <= 5; i++){
  setTimeout(function(){
    console.log(i);
  })
}
```
解决上面的问题，在每个循环迭代中都需要一个闭包作用域，下面示例，循环中的每个迭代器都会生成一个新的作用域。
``` javascript
for(var i=1; i <= 5; i++){
  (function(j){
    setTimeout(function(){
      console.log(j);
    })
  })(i)
}
```
也可以使用let解决，let声明，可以用来劫持块作用域，并且在这个块作用域中声明一个变量。
``` javascript
for(let i=1; i <= 5; i++){
  setTimeout(function(){
    console.log(i);
  })
}
```
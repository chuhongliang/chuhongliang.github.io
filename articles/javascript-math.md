>Math 是一个内置对象， 它具有数学常数和函数的属性和方法。不是一个函数对象。与其他全局对象不同的是，Math 不是一个构造器。 Math 的所有属性与方法都是静态的。

#### 1. ``Math.abs(x)`` 返回绝对值
```js
let a = -1;
console.log(Math.abs(a));// 1
```

#### 2. ``Math.ceil(x)`` 返回x向上取整后的值
```js
let a = 1.5;
let b = 1.4;
console.log(Math.ceil(a));// 2
console.log(Math.ceil(b));// 2
```

#### 3. ``Math.floor(x)`` 返回x向下取整后的值
```js
let a = 1.5;
let b = 1.4;
console.log(Math.floor(a));// 1
console.log(Math.floor(b));// 1
```

#### 4. ``Math.min(x)``  返回最小值
```js
let a = 3;
let b = 1;
let c = 2;
let result = Math.min(a, b, c);
console.log(result);// 1
```

#### 5. ``Math.max(x)`` 返回最大值
```js
let a = 3;
let b = 1;
let c = 2;
let result = Math.max(a, b, c);
console.log(result);// 3
```

#### 6. ``Math.pow(x, y)`` 返回x的y次幂
```js
let a = 3;
let b = 3;
let result = Math.pow(a, b);
console.log(result);// 27
```

#### 7. ``Math.random(x)`` 返回0-1之间的伪随机数
```js
let result = Math.floor(Math.random() * 10);
console.log(result);// 10 以内的随机数
```

#### 8. ``Math.round(x)`` 返回四舍五入后的整数
```js
let a = 1.5;
let b = 1.4;
console.log(Math.round(a));// 2
console.log(Math.round(b));// 1
```

#### 9. ``Math.sign(x)`` 返回x的符号函数，判断x是正数、负数还是0 
```js
let a = 1.5;
let b = - 1.4;
let c = 0;
console.log(Math.sign(a));// 1
console.log(Math.sign(b));// -1
console.log(Math.sign(c));// 0
```
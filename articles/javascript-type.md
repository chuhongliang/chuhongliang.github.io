
### 原始类型与引用类型
- JavaScript原始类型: Undefined、Null、Boolean、Number、String、Symbol 
- JavaScript引用类型: Object 


#### 原始类型(基础类型)
- **原始类型**又被称为**基本类型**，原始类型保存的变量和值直接保存在**栈内存**(Stack)中,且空间相互独立,通过值来访问

```js
let name = 'jane';
let name1 = name;
console.log(name === name1);//true
name = 'tom';
console.log(name);//tome
console.log(name1);//jane
```
可以看到name的值虽然改变，但是name1的值是独立存储的所以不受影响

虽然原始类型的值是储存在相对独立空间,但是它们之间的比较是按值比较的.

&nbsp;

#### 引用类型
- 引用类型,即Object 类型,再往下细分，还可以分为：Object 类型、Array 类型、Date 类型、Function 类型 等。
- 与原始类型不同的是,引用类型的内容是保存在**堆内存**中,而**栈内存**(Heap)中会有一个**堆内存地址**,通过这个地址变量被指向堆内存中`Object`真正的值,因此引用类型是按照引用访问的.

```js
let person1 = { name: "tome", age: 20 };
let person2 = person1;
person1.name = "jane";
console.log(person2.name);    // jane
person2.age = 22;
console.log(person1.age);     // 22
var person3 = {
	name: "jane",
	age: 22
};
console.log(person1 === person3); //false
```
person1和person2两个变量指向了同一个对象。因此，改变其中任何一个变量，都会相互影响

person3是新建了一个对象, 在堆内存中确实两个相互独立的Object,引用类型是按照引用比较,由于person1和person3引用的是不同的Object所以得到的结果是fasle.

&emsp;

---
&emsp;

### 类型中的坑
#### 1. 稀疏数组: 指的是含有空白或空缺单元的数组

```js
let arr = [];
console.log(arr.length); //0
arr[4] = arr[5];
console.log(arr.length); //5
arr.forEach(elem => {
  console.log(elem); //undefined
});
console.log(arr); //[,,,,undefined]
```
这里有几个坑需要注意:

- 开始建立的空数组a的长度为0,这可以理解,但是在a[4] = a[5]之后出现了问题,a的长度居然变成了5,此时a数组是[,,,,undefined]这种形态.
- 我们通过遍历,只得到了undefined这一个值,这个undefind是由于a[4] = a[5]赋值,由于a[5]没有定义值为undefined被赋给了a[4],可以等价为a[4] = undefined.

#### 2. 字符串索引
```js
let a = [];
a[0] = 1;
a['name'] = 'tom';
console.log(a.length); //1
console.log(a['name']); //tom
console.log(a); //[ 1, name: 'tom' ]
```
数组不仅可以通过数字索引,也可以通过字符串索引,但值得注意的是,字符串索引的键值对并不算在数组的长度里.

#### 3. 数字中的坑 二进制浮点数
JavaScript 中的数字类型是基于“二进制浮点数”实现的,使用的是“双精度”格式,这就带来了一些反常的问题,我们那一道经典面试提来讲解下.

```js
let a = 0.1 + 0.2;
let b = 0.3;
console.log(a === b); //false
```
这是个出人意料的结果,实际上a的值约为0.30000000000000004这并不是一个整数值,这就是二进制浮点数带来的副作用.

```js
let a = 0.1 + 0.2;
let b = 0.3;
console.log(a === b); //false
console.log(Number.isInteger(a*10)); //false
console.log(Number.isInteger(b*10)); //true
console.log(a); //0.30000000000000004
```
我们可以用Number.isInteger()来判断一个数字是否为整数.

#### 4. NaN
```js
let a = 1/new Object();
console.log(typeof a); //Number
console.log(a); //NaN
console.log(isNaN(a)); //true
```
NaN属于特殊的Number类型,我们可以把它理解为坏数值,因为它属于数值计算中的错误,更加特殊的是它自己都不等价于自己NaN === NaN //false,我们只能用isNaN()来检测一个数字是否为NaN.

&emsp;

---

&emsp;

### 类型判断
- 类型检测主要包括了: typeof、instanceof和toString的三种方式来判断变量的类型。
- typeof: 用来检测基本类型
- toString: typeof的增强,用来判断内置的数据类型,无法判断构造函数创建的对象.
- instanceof: 用来判断使用构造函数创建的对象.

#### **``typeof``**
typeof接受一个值并返回它的类型，它有两种可能的语法：
- typeof x
- typeof(x)
  
当在primitive类型上使用typeof检测变量类型时，我们总能得到我们想要的结果，比如
```js
typeof 1; // "number"
typeof ""; // "string"
typeof true; // "boolean"
typeof bla; // "undefined"
typeof undefined; // "undefined"
```
而当在object类型上使用typeof检测时，有时可能并不能得到你想要的结果，比如：
```js
typeof []; // "object"
typeof null; // "object"
typeof /regex/ // "object"
typeof new String(""); // "object"
typeof function(){}; // "function"
```
这里的[]返回的确却是object，这可能并不是你想要的，因为数组是一个特殊的对象，有时候这可能并不是你想要的结果。

对于这里的null返回的确却是object，wtf，有些人说null被认为是没有一个对象。

当你对于typeof检测数据类型不确定时，请谨慎使用。

#### **``toString``**
toString不管是对于object类型还是primitive类型，都能得到你想要的结果：
```js
let toClass = {}.toString;
console.log(toClass.call(123));
console.log(toClass.call(true));
console.log(toClass.call(Symbol('foo')));
console.log(toClass.call('some string'));
console.log(toClass.call([1, 2]));
console.log(toClass.call(new Date()));
console.log(toClass.call({
    a: 'a'
}));
// output
[object Number]
[object Boolean]
[object Symbol]
[object String]
[object Array]
[object Date]
[object Object]
```

#### **``instanceof``**
对于使用构造函数创建的对象，我们通常使用instanceof来判断某一实例是否属于某种类型，例如：a instanceof Person，其内部原理实际上是判断Person.prototype是否在a实例的原型链中，其原理可以用下面的函数来表达：
```js
function instance_of(V, F) {
  let O = F.prototype;
  V = V.__proto__;
  while (true) {
    if (V === null)
      return false;
    if (O === V)
      return true;
    V = V.__proto__;
  }
}
// use
function Person() {
}
let a = new Person();
// true
console.log(instance_of(a, Person));
```
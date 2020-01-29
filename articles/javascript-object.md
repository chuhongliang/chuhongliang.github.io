### Ojbect相关常用方法

#### 1. ``Object.assign(target,source1,source2,...)`` 通过复制一个或多个对象来创建一个新对象
```js
let person1 = {
  name: 'tom',
  age: 20,
  sex: 1,
}
let person2 = {
  name: 'jane',
  age: 40,
}
let person3 = Object.assign(person2, person1);
console.log(person3);//{ name: 'tom', age: 20, sex: 1 }
let person4 = Object.assign({}, person3);
console.log(person4);//{ name: 'tom', age: 20, sex: 1 }
```

#### 2. ``Object.create(prototype,[propertiesObject])`` 使用指定的原型对象和属性创建一个新对象
```js
let parent = {
  x: 1,
  y: 2
}
let child = Object.create(parent, {
  z: {// z会成为创建对象的属性
    value: 3,             // 初始化赋值
    writable: true,       // 是否是可改写的
    configurable: true,   // 是否能够删除，是否能够被修改
    enumerable: true,     //是否可以用for in 进行枚举
  }
});
console.log(child);//{ z: 3 }
console.log(child.__proto__);// { x: 1, y: 2 }
```

#### 3. ``Object.defineProperty(obj,prop,descriptor)`` 在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
```js
let parent = {
  x: 1,
  y: 2
}
Object.defineProperty(parent, 'z', {
  writable: true,
  configurable: true,
  value: 3,
  enumerable: true
});
console.log(parent);//{ x: 1, y: 2, z: 3 }
```

#### 4. ``Object.defineProperties(obj,props)`` 在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
```js
let parent = {
  x: 1,
  y: 2
}
Object.defineProperties(parent, {
  z: {
    writable: true,
    configurable: true,
    value: 3,
    enumerable: true
  },
  i: {
    writable: true,
    configurable: true,
    value: 4,
    enumerable: true
  },
});
console.log(parent);//{ x: 1, y: 2, z: 3, i: 4 }
```

#### 5. ``Object.keys()`` 返回一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 （两者的主要区别是 一个 for-in 循环还会枚举其原型链上的属性）。
```js
let person = {
  name: 'tom',
  age: 20,
  sex: 1,
}
console.log(Object.keys(person));//[ 'name', 'age', 'sex' ]
```

#### 6. ``Object.values()`` 方法返回一个给定对象自己的所有可枚举属性值的数组，值的顺序与使用for...in循环的顺序相同 ( 区别在于 for-in 循环枚举原型链中的属性 )。

Object.values会过滤属性名为 Symbol 值的属性。
```js
let person = {
  name: 'tom',
  age: 20,
  sex: 1,
}
console.log(Object.values(person));//[ 'tom', 20, 1 ]
```

#### 7. ``Object.entries()``  返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环也枚举原型链中的属性）。
```js
let person = {
  name: 'tom',
  age: 20,
}
console.log(Object.entries(person));//[ [ 'name', 'tom' ], [ 'age', 20 ] ]
```

#### 8. ``hasOwnProperty()`` 判断对象自身属性中是否具有指定的属性。
```js
let person = {
  name: 'tom',
  age: 20,
}
console.log(person.hasOwnProperty('name'));//true
console.log(person.hasOwnProperty('set'));//false
```

#### 9. ``Object.is()`` 判断两个值是否相同。
- 两个值都是 undefined
- 两个值都是 null
- 两个值都是 true 或者都是 false
- 两个值是由相同个数的字符按照相同的顺序组成的字符串
- 两个值指向同一个对象
- 两个值都是数字并且
  - 都是正零 +0
  - 都是负零 -0
  - 都是 NaN
  - 都是除零和 NaN 外的其它同一个数字

```js
Object.is('foo', 'foo');     // true
Object.is(window, window);   // true

Object.is('foo', 'bar');     // false
Object.is([], []);           // false

let test = { a: 1 };
Object.is(test, test);       // true
Object.is(null, null);       // true
// 特例
Object.is(0, -0);            // false
Object.is(-0, -0);           // true
Object.is(NaN, 0/0);         // true
```

#### 10. ``Object.freeze()``冻结一个对象，冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。也就是说，这个对象永远是不可变的。该方法返回被冻结的对象。
```js
let obj = {
  i: 10,
  x: 1,
  y: 2,
};
// 新的属性会被添加, 已存在的属性可能
// 会被修改或移除
obj.z = 3;
delete obj.i;

// 作为参数传递的对象与返回的对象都被冻结
// 所以不必保存返回的对象（因为两个对象全等）
let o = Object.freeze(obj);

o === obj; // true
Object.isFrozen(obj); // === true

// 现在任何改变都会失效
obj.x = 10; // 静默地不做任何事
obj.k = 4; // 静默地不添加此属性
console.log(obj);
```

#### 11. ``Object.isFrozen()`` 判断一个对象是否被冻结.
```js
let obj = {
  i: 10,
};
Object.freeze(obj);
Object.isFrozen(obj); // === true
```

#### 12. ``Object.preventExtensions()``对象不能再添加新的属性。可修改，删除现有属性，不能添加新属性。
```js
let obj = {
  x: 1,
  y: 2,
  z: 3,
}
obj = Object.preventExtensions(obj);
console.log(obj);    // { x: 1, y: 2, z: 3 }
obj.i = 4;
console.log(obj)     // { x: 1, y: 2, z: 3 }
delete obj.z;
console.log(obj);    // { x: 1, y: 2 }
obj.k = 5;
console.log(obj)     // { x: 1, y: 2 }
```

#### 13.``Object.isExtensible()`` 判断对象是否是可扩展的，Object.preventExtensions，Object.seal 或 Object.freeze 方法都可以标记一个对象为不可扩展（non-extensible）
```js
let obj = {
  x: 1,
}
console.log(Object.isExtensible(obj));// === true
Object.preventExtensions(obj);
// Object.freeze(obj);
// Object.seal(obj);
console.log(Object.isExtensible(obj));/// === false 
```

#### 14. ``Object.seal()``方法可以让一个对象密封，并返回被密封后的对象。密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。但属性的值仍然可以修改。尝试删除一个密封对象的属性或者将某个密封对象的属性从数据属性转换成访问器属性，结果会静默失败或抛出TypeError 异常. 不会影响从原型链上继承的属性。但 __proto__ (  ) 属性的值也会不能修改。
```js
let obj = {
	i: 10,
	x: 1,
};
// 可以添加新的属性,已有属性的值可以修改,可以删除
obj.y = 2;
delete obj.i;

let o = Object.seal(obj);

// 仍然可以修改密封对象上的属性的值.
obj.x = 20;

// 但你不能把一个数据属性重定义成访问器属性.
Object.defineProperty(obj, "x", { get: function () { return 10; } }); // 抛出TypeError异常

// 现在,任何属性值以外的修改操作都会失败.
obj.z = 3; // 静默失败,新属性没有成功添加
delete obj.y; // 静默失败,属性没有删除成功

// 使用Object.defineProperty方法同样会抛出异常
Object.defineProperty(obj, "k", { value: 17 }); // 抛出TypeError异常
Object.defineProperty(obj, "x", { value: 100 }); // 成功将原有值改变
```

#### 15. ``Object.isSealed()`` 判断一个对象是否被密封
```js
let obj = {
	x: 1,
};
Object.seal(obj);
console.log(Object.isSealed(obj)); // === true;
```
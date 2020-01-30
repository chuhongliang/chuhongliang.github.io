>JavaScript 的数组是无类型的，数组元素可以是任意类型，同一个数组中的不同元素可能是对象或数组。数组元素的索引不一定要连续，元素之间可以有空隙，叫做稀疏数组 。每个数组都具有一个lengrh属性。针对非稀疏数组，length属性就是数组元素的个数，针对稀疏数组，元素的length属性比所有元素的索引要大。非稀疏是我们学习掌握的主要知识点。

### **下面这些方法会改变数组自身的值：**
	
#### 1. ``Array.prototype.pop()`` 删除数组的最后一个元素，并返回这个元素
```js
let arr = [1, 2, 3];
let value = arr.pop();
console.log(value);// 3
```

#### 2. ``Array.prototype.push()`` 在数组的末尾增加一个或多个元素，并返回数组长度
```js
let arr = [1, 2, 3];
arr.push(4);
console.log(arr);// [ 1, 2, 3, 4 ]
```

#### 3. ``Array.prototype.shift()`` 删除数组的第一个约束，并返回这个元素
```js
let arr = [1, 2, 3];
let value = arr.shift();
console.log(value);// 1
```

#### 4. ``Array.prototype.unshift()`` 在数组的开头增加一个或多个元素，并返回数组长度
```js
let arr = [1, 2, 3];
arr.unshift(0);
console.log(arr);// [ 0, 1, 2, 3 ]
```

#### 5. ``Array.prototype.sort()`` 对数组进行排序，并返回当前数组。
```js
let arr = [3, 1, 2];
arr.sort();
console.log(arr);// [ 1, 2, 3 ]
arr.sort(function (a, b) {
  if (a < b) return 1;
  if (a > b) return -1;
  if (a === b) return 0;
})
console.log(arr);// [ 3, 2, 1 ]
```

#### 6. ``Array.prototype.reverse()`` 颠倒数组中元素的排列顺序。
```js
let arr = [3, 2, 1];
arr.reverse();
console.log(arr);// [ 1, 2, 3 ]
```

#### 7. ``Array.prototype.splice()`` 在任意位置给数组添加或删除任意个元素。
```js
let arr = ['a', 'b', 'c'];
arr.splice(3, 0, 'd', 'e');//添加
console.log(arr);// [ 'a', 'b', 'c', 'd', 'e' ]
arr.splice(0, 2);//删除
console.log(arr);//['c', 'd', 'e']
```

&nbsp;

---

&nbsp;

### **下面这些方法不会改变数组自身的值，只会返回一个新的数组或者其他值：**

#### 1. ``Array.prototype.concat()`` 返回当前数组和其他若干数组或者若干个费数组值组合而成的新数组
```js
let arr1 = ['a', 'b', 'c'];
let arr2 = ['d', 'e', 'f'];
let arr3 = arr1.concat(arr2);
console.log(arr3);// [ 'a', 'b', 'c', 'd', 'e', 'f' ]
```

#### 2. ``Array.prototype.includes()`` 判断当前数组是否包含某指定的值。
```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f']
let result = arr.includes('c');
console.log(result);// true
```

#### 3. ``Array.prototype.join()`` 连接所有数组元素组成一个字符串
```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f']
let result = arr.join('');
console.log(result);// abcdef
```

#### 4. ``Array.prototype.slice()`` 抽取当前数组中的一段元素组合成一个新数组
```js
let arr1 = ['a', 'b', 'c', 'd', 'e', 'f']
let arr2 = arr1.slice(0, 3);
console.log(arr2);// [ 'a', 'b', 'c' ]
```

#### 5. ``Array.prototype.toString()`` 返回由数组元素组成的字符串
```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f']
let result = arr.toString();
console.log(result);// a,b,c,d,e,f
```

#### 6. ``Array.prototype.indexOf()`` 返回数组中第一个与指定值相等的元素的索引，如果找不到返回-1
```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f']
let index = arr.indexOf('a');
console.log(index);// 0
```

#### 7. ``Array.prototype.lastIndexOf()`` 返回数组中最后一个与指定值相等的元素的索引，如果找不到返回-1
```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'a']
let index = arr.lastIndexOf('a');
console.log(index);// 6
```
   
&nbsp;

---

&nbsp;

### **遍历方法:**

#### 1. ``Array.prototype.forEach()`` 为数组中每一个元素执行一次回调。
```js
let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'a']
arr.forEach((item, index, array) => {
	if (item === 'a') {
		array.splice(index, 1);
	}
});
console.log(arr);//[ 'b', 'c', 'd', 'e', 'f' ]
```
#### 2. ``Array.prototype.every()`` 如果数组中每个元素都满足测试函数，则返回true，否则返回false；
```js
let arr = [1, 2, 3, 4, 5];
let result = arr.every((item) => {
  return item > 0;
});
console.log(result);// === true
```
#### 3. ``Array.prototype.some()`` 如果数组中至少有一个元素满足测试函数，则返回true，否则返回false
```js
let arr = [1, 2, 3, -1, 4, 5];
let result = arr.some((item) => {
  return item < 0;
});
console.log(result);// === true
```

#### 4. ``Array.prototype.filter()`` 将所有在过滤函数中返回true的数组元素放假一个新数组中并返回。
```js
let arr = [1, 2, 3, -1, 4, 5];
let result = arr.filter((item) => {
  return item > 0;
});
console.log(result);// [ 1, 2, 3, 4, 5 ]
```

#### 5. ``Array.prototype.find()`` 找到第一个满足测试函数的元素并返回那个元素的值，如果找不到，返回undefined
```js
let arr = [1, 2, 3, -1, 4, 5];
let result = arr.find((item) => {
  return item < 0;
});
console.log(result);// -1
```

#### 6. ``Array.prototype.map()`` 返回一个由回调函数的返回值组成的新数组,不会改变原始数组。
```js
let arr = [1, -3, 3, -1, 4, 5];
let result = arr.map((item) => {
  return Math.abs(item);
});
console.log(result);// [ 1, 3, 3, 1, 4, 5 ]
```

#### 7. ``Array.prototype.reduce()`` 从左到右为每个元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。
```js
let arr = [1, -3, 3, -1, 4, 5];
/**
 * previousValue: 表示上一次调用回调时的返回值，或者初始值 init
 * currentValue: 表示当前正在处理的数组元素
 * currentIndex: 表示当前正在处理的数组元素的索引，若提供 init 值，则索引为0，否则索引为1；
 * array: 原数组
 */
let result = arr.reduce((previousValue, currentValue) => {
  return previousValue + currentValue;//求和
});
console.log(result);// 9
```

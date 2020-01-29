
#### 1. ``String.prototype.indexOf()`` 从字符串对象中返回首个被发现的给定值的索引，没找到返回-1
```js
let str = 'abcde';
let index = str.indexOf('c');
console.log(index);//2
```

#### 2. ``String.prototype.lastIndexOf()`` 从字符串对象中返回最后一个被发现的给定值的索引，没找到返回-1
```js
let str = 'dabcde';
let index = str.lastIndexOf('d');
console.log(index);//4
```

#### 3. ``String.prototype.charAt()`` 返回特定位置的字符
```js
let str = 'dabcde';
let char = str.charAt(3);
console.log(char);//c
```

#### 4. ``String.prototype.split()`` 将字符串分割为数组
```js
let str = 'dabcde';
let arr = str.split('');
console.log(arr);//[ 'd', 'a', 'b', 'c', 'd', 'e' ]
```

#### 5. ``String.prototype.includes()`` 判断一个字符串是否包含某个字符
```js
let str = 'dabcde';
let flag = str.includes('ab');
console.log(flag);//true
```

#### 6. ``String.prototype.slice()`` 摘取一个字符串区域，返回一个新字符串
&emsp;**参数**:
- **start**: number 起始位置(包括) 必需，可以是负整数
- **end**: number 结束位置(不包括) 可选，可以是负整数
  
```js
let str = 'dabcde';
let newStr = str.slice(0, 3);
console.log(newStr);//dab
```

#### 7. ``String.prototype.substring()`` 返回在字符串中指定两个下标之间的字符
&emsp;**参数**:
- **start**: number 起始位置(包括) 必需，非负整数
- **end**: number 结束位置(不包括) 可选，非负整数

```js
let str = 'dabcde';
let newStr = str.substring(0, 3);
console.log(newStr);//dab
```

#### 8. ``String.prototype.substr()`` 通过指定字符数返回在指定位置开始的字符串中的字符。
&emsp;**参数**:
- **from**: number 起始位置 必需，可以是负整数
- **length**: number 长度 可选，非负整数
  
```js
let str = 'dabcde';
let newStr = str.substr(0, 3);
console.log(newStr);//dab
```

#### 9.  ``String.prototype.trim()`` 从字符串的开始和结尾去除空格
```js
let str = ' dabcde ';
let newStr = str.trim();
console.log(newStr);//dabcde
```

#### 10. ``String.prototype.concat()`` 连接两个字符串，返回新字符串
```js
let str1 = 'dabcde';
let str2 = 'fghijk';
let str3 = str1.concat(str2);
console.log(str3);//dabcdefghijk
```

#### 11. ``String.prototype.match()`` 使用正则表达式
```js
let str = 'cat, bat, fat, sat';
let regExp = /.at/g;
let result = str.match(regExp);
console.log(result);//[ 'cat', 'bat', 'fat', 'sat' ]
```

#### 12. ``String.prototype.test()`` 用于检测一个字符串是否匹配某个模式
```js
let str = 'cat, bat, fat, sat';
let regExp = /.at/g;
let result = regExp.test(str);
console.log(result);//true
```

#### 13. ``String.prototype.toLowerCase()`` 把字符串转换为小写
```js
let str = 'CAT, BAT, FAT, SAT';
let result = str.toLowerCase();
console.log(result);//cat, bat, fat, sat
```

#### 14. ``String.prototype.toUpperCase()`` 把字符串转换为大写
```js
let str = 'cat, bat, fat, sat';
let result = str.toUpperCase();
console.log(result);//CAT, BAT, FAT, SAT
```
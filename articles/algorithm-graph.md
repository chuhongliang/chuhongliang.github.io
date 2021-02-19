

### 直角三角形:
```js
* 
* * 
* * * 
* * * * 
* * * * * 
```
```js
for (let x = 1; x <= 5; x++) {
	let s = '';
	for (let y = 1; y <= x; y++) {
		s += `* `
	}
	console.log(s);
}
```

### 倒立直角三角形:
```js
* * * * * 
* * * * 
* * * 
* * 
*
```
```js
for (let x = 5; x >= 1; x--) {
	let s = '';
	for (let y = 1; y <= x; y++) {
		s += `* `
	}
	console.log(s);
}
```

### 等腰三角形:
```js
     * 
    * * 
   * * * 
  * * * * 
 * * * * * 
```
```js
for (let x = 1; x <= 5; x++) {
	let s = '';
	for (let z = 6 - x; z >= 1; z--) {
		s += ' '
	}
	for (let y = 1; y <= x; y++) {
		s += `* `
	}
	console.log(s);
}
```

### 右直角三角形:
```js
          * 
        * * 
      * * * 
    * * * * 
  * * * * * 
```
```js
for (let x = 1; x <= 5; x++) {
	let s = '';
	for (let z = 6 - x; z >= 1; z--) {
		s += '  '
	}
	for (let y = 1; y <= x; y++) {
		s += `* `
	}
	console.log(s);
}
```

### 倒立右直角三角形:
```js
  * * * * * 
    * * * * 
      * * * 
        * * 
          *
```
```js
for (let x = 5; x >= 1; x--) {
	let s = '';
	for (let z = 6 - x; z >= 1; z--) {
		s += '  '
	}
	for (let y = 1; y <= x; y++) {
		s += `* `
	}
	console.log(s);
}
```

### 倒立等腰三角形:
```js
 * * * * * 
  * * * * 
   * * * 
    * * 
     * 
```
```js
for (let x = 9; x >= 1; x--) {
	let s = '';
	for (let z = 10 - x; z >= 1; z--) {
		s += ' '
	}
	for (let y = 1; y <= x; y++) {
		s += `* `
	}
	console.log(s);
}
```

### 菱形:
```js
     * 
    * * 
   * * * 
  * * * * 
 * * * * * 
  * * * * 
   * * * 
    * * 
     * 
```
```js
for (let x = 1; x <= 5; x++) {
	let s = '';
	for (let z = 6 - x; z >= 1; z--) {
		s += ' '
	}
	for (let y = 1; y <= x; y++) {
		s += `* `
	}
	console.log(s);
}
for (let x = 4; x >= 1; x--) {
	let s = '';
	for (let z = 6 - x; z >= 1; z--) {
		s += ' '
	}
	for (let y = 1; y <= x; y++) {
		s += `* `
	}
	console.log(s);
}
```

### 九九乘法口诀表:
```js
1 x 1 = 1  
1 x 2 = 2  2 x 2 = 4  
1 x 3 = 3  2 x 3 = 6  3 x 3 = 9  
1 x 4 = 4  2 x 4 = 8  3 x 4 = 12  4 x 4 = 16  
1 x 5 = 5  2 x 5 = 10  3 x 5 = 15  4 x 5 = 20  5 x 5 = 25  
1 x 6 = 6  2 x 6 = 12  3 x 6 = 18  4 x 6 = 24  5 x 6 = 30  6 x 6 = 36  
1 x 7 = 7  2 x 7 = 14  3 x 7 = 21  4 x 7 = 28  5 x 7 = 35  6 x 7 = 42  7 x 7 = 49  
1 x 8 = 8  2 x 8 = 16  3 x 8 = 24  4 x 8 = 32  5 x 8 = 40  6 x 8 = 48  7 x 8 = 56  8 x 8 = 64  
1 x 9 = 9  2 x 9 = 18  3 x 9 = 27  4 x 9 = 36  5 x 9 = 45  6 x 9 = 54  7 x 9 = 63  8 x 9 = 72  9 x 9 = 81 
```
```js
// 列数小于行数
for (let x = 1; x <= 9; x++) {
	let s = '';
	for (let y = 1; y <= x; y++) {
		s += `${y} x ${x} = ${x * y}  `
	}
	console.log(s);
}
```